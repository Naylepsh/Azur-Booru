const { Post, validate } = require("../models/post");
const { Tag } = require("../models/tag");
const { Comment } = require("../models/comment");
const { User } = require("../models/user");
const { StatusError } = require("../utils/errors");
const { paginationInfo } = require("../utils/pagination");
const { upload_path } = require("../utils/storage");
const miscUtils = require("../utils/misc");
const mongoose = require("mongoose");

const POSTS_PER_PAGE = 20;
const TAGS_PER_PAGE = 15;
const POST_BODY_ATTRIBUTES = ["source", "tags", "rating"];

exports.list = async (req, res) => {
  const containsTagsQuery = await createContainsTagsDbQueryFromUrlQuery(
    req.query.tags
  );
  const currentPage = req.query.page;
  const pageInfo = await createPostPaginationDetails(
    containsTagsQuery,
    currentPage
  );

  const posts = await getPostPage(containsTagsQuery, pageInfo);
  const tags = await Tag.popularTagsOfPosts(posts, TAGS_PER_PAGE);

  res.send({ posts, tags, pageInfo });
};

async function createContainsTagsDbQueryFromUrlQuery(tagsQuery) {
  const tagNames = miscUtils.distinctWordsInString(tagsQuery);
  const dbQuery = await createRelatedTagsDbQueryFromTagNames(tagNames);

  return dbQuery;
}

async function createRelatedTagsDbQueryFromTagNames(tagNames) {
  const tagsInQuery = await Tag.findManyByName(tagNames);
  const tagsIds = tagsInQuery.map((tag) => tag._id);
  const query = tagsInQuery.length > 0 ? { tags: { $all: tagsIds } } : {};

  return query;
}

async function createPostPaginationDetails(query, currentPage) {
  const numberOfRecords = await Post.countDocuments(query);
  const pageInfo = paginationInfo(numberOfRecords, currentPage, POSTS_PER_PAGE);

  return pageInfo;
}

async function getPostPage(query, pageInfo) {
  const postsToSkip = (pageInfo.currentPage - 1) * POSTS_PER_PAGE;
  const posts = await Post.paginate(query, postsToSkip, POSTS_PER_PAGE);

  return posts;
}

exports.create = async (req, res) => {
  const prefix = "http://localhost:3001/api/v1/images/";
  const imageUrl = prefix + req.file.filename;
  const thumbnailUrl = prefix + req.thumbnail.filename;
  const postModel = mapPostToViewModel(
    req.body,
    imageUrl,
    thumbnailUrl,
    req.user._id
  );

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await createPostInDatabase(postModel, session);
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw new StatusError(500, error.message);
  } finally {
    session.endSession();
    res.send(postModel);
  }
};

function validatePost(post) {
  const { error } = validate(post);
  if (error) {
    throw new StatusError(400, error.details[0].message);
  }
}

async function createPostInDatabase(postModel, session) {
  const tags = await Tag.findOrCreateManyByName(postModel.tags, session);
  postModel.tags = tags.map((tag) => tag._id);

  const posts = await Post.create([postModel], { session });
  post = posts[0];

  await attachPostToTags(tags, post);

  return post;
}

function attachPostToTags(tags, post) {
  return Promise.all(tags.map((tag) => tag.addPost(post._id)));
}

exports.show = async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("author", "name")
    .populate("tags")
    .populate({
      path: "comments",
      populate: { path: "author", model: "User" },
    });
  ensurePostWasFound(post);

  const sortedTags = Tag.sortByName(post.tags);
  const tagsOccurences = Tag.getOccurences(sortedTags);
  delete post.author.password;

  res.send({ post: post, tags: tagsOccurences });
};

exports.update = async (req, res) => {
  const post = await Post.findById(req.params.id).populate("tags");
  ensurePostWasFound(post);

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const postModel = mapPostToViewModel(
      req.body,
      post.imageLink,
      post.thumbnailLink,
      req.user._id
    );

    await removeAllTagsFromPost(post);
    const tags = await Tag.findOrCreateManyByName(postModel.tags, session);
    postModel.tags = tags.map((tag) => tag._id);
    await attachPostToTags(tags, post);

    await updatePost(post, postModel);
    await session.commitTransaction();

    res.send({ post });
  } catch (error) {
    await session.abortTransaction();
    if (error instanceof StatusError) {
      throw error;
    } else {
      throw new StatusError(500, error.message);
    }
  } finally {
    session.endSession();
  }
};

function mapPostToViewModel(post, imageLink, thumbnailLink, authorId) {
  const postModel = miscUtils.pickAttributes(post, POST_BODY_ATTRIBUTES);
  postModel.tags = miscUtils.distinctWordsInArray(postModel.tags);
  postModel.score = 0;
  postModel.imageLink = imageLink;
  postModel.thumbnailLink = thumbnailLink;
  postModel.author = authorId;

  validatePost(postModel);

  return postModel;
}

async function updatePost(post, propertiesToUpdate) {
  for (const key in propertiesToUpdate) {
    post[key] = propertiesToUpdate[key];
  }
  await post.save();
}

async function removeAllTagsFromPost(post) {
  return Promise.all(post.tags.map((tag) => tag.removePost(post._id)));
}

exports.destroy = async (req, res) => {
  const post = await Post.findById(req.params.id).populate("tags");
  ensurePostWasFound(post);

  const isAuthor = await authenticateAuthor(post, req.user);
  const isAdmin = req.user.roles && req.user.roles.admin;
  if (!isAuthor && !isAdmin) {
    throw new StatusError(403, "Access denied");
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await detachTagsFromPost(post);
    await removePostComments(post, session);
    await Post.findByIdAndRemove(post._id);

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw new StatusError(500, error.message);
  } finally {
    session.endSession();
    res.send(post);
  }
};

function detachTagsFromPost(post) {
  // mongoose keeps a reference to session on object that was created by find()
  // thus, no reason to pass session here
  return Promise.all(post.tags.map((tag) => tag.removePost(post._id)));
}

function removePostComments(post, session) {
  return Comment.deleteMany({ _id: { $in: post.comments } }).session(session);
}

exports.toggleVote = async (req, res) => {
  let post = await Post.findById(req.params.id);
  ensurePostWasFound(post);

  if (req.body.voteType === "up") {
    miscUtils.toggleInArray(req.user._id, post.voters.up);
    miscUtils.removeFromArrayIfExists(req.user._id, post.voters.down);
  } else if (req.body.voteType === "down") {
    miscUtils.toggleInArray(req.user._id, post.voters.down);
    miscUtils.removeFromArrayIfExists(req.user._id, post.voters.up);
  }
  post.score = post.voters.up.length - post.voters.down.length;
  await post.save();

  res.end(post.score.toString());
};

exports.voteUp = async (req, res) => {
  const post = await Post.findById(req.params.id);
  ensurePostWasFound(post);

  miscUtils.toggleInArray(req.user._id, post.voters.up);
  miscUtils.removeFromArrayIfExists(req.user._id, post.voters.down);
  post.score = post.voters.up.length - post.voters.down.length;
  await post.save();

  res.send(post.score.toString());
};

exports.voteDown = async (req, res) => {
  const post = await Post.findById(req.params.id);
  ensurePostWasFound(post);

  miscUtils.toggleInArray(req.user._id, post.voters.down);
  miscUtils.removeFromArrayIfExists(req.user._id, post.voters.up);
  post.score = post.voters.up.length - post.voters.down.length;
  await post.save();

  res.send(post.score.toString());
};

async function authenticateAuthor(post, user) {
  const author = await User.findById(post.author);

  return user._id === author._id.toString();
}

function ensurePostWasFound(post) {
  if (!post) {
    throw new StatusError(404, `Post not found`);
  }
}
