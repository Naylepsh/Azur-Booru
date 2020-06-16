const { Post, validate } = require("../models/post");
const { Tag } = require("../models/tag");
const { Comment } = require("../models/comment");
const { User } = require("../models/user");
const { StatusError } = require("../utils/errors");
const { paginationInfo } = require("../utils/pagination");
const miscUtils = require("../utils/misc");
const mongoose = require("mongoose");

const POSTS_PER_PAGE = 20;
const TAGS_PER_PAGE = 15;
const POST_BODY_ATTRIBUTES = ["source", "title", "tags", "rating"];

exports.list = async (req, res) => {
  const containsTagsQuery = await createContainsTagsDbQueryFromUrlQuery(
    req.query.tags
  );
  const pageInfo = createPostPaginationDetails(containsTagsQuery);

  const posts = await getPostPage(containsTagsQuery, pageInfo);
  const tags = await Tag.popularTagsOfPosts(posts, TAGS_PER_PAGE);

  res.send({
    posts,
    tags,
    pageInfo,
  });
};

async function createContainsTagsDbQueryFromUrlQuery(tagsQuery) {
  const tagNames = miscUtils.distinctWordsInString(tagsQuery);
  const dbQuery = await createRelatedTagsDbQueryFromTagNames(tagNames);

  return dbQuery;
}

async function createRelatedTagsDbQueryFromTagNames(tagNames) {
  const tagsInQuery = await Tag.findOrCreateManyByName(tagNames);
  const tagsIds = tagsInQuery.map((tag) => tag._id);
  const query = tagsInQuery.length > 0 ? { tags: { $all: tagsIds } } : {};

  return query;
}

async function createPostPaginationDetails(query) {
  const numberOfRecords = await Post.countDocuments(query);
  const pageInfo = paginationInfo(
    numberOfRecords,
    req.query.page,
    POSTS_PER_PAGE
  );

  return pageInfo;
}

async function getPostPage(query, pageInfo) {
  const postsToSkip = (pageInfo.currentPage - 1) * POSTS_PER_PAGE;
  const posts = await Post.paginate(query, postsToSkip, POSTS_PER_PAGE);

  return posts;
}

function mapPostToViewModel(post, imageLink, thumbnailLink, authorId) {
  const postModel = miscUtils.pickAttributes(post, POST_BODY_ATTRIBUTES);
  postModel.tags = miscUtils.distinctWordsInString(postModel.tags);
  postModel.score = 0;
  postModel.imageLink = imageLink;
  postModel.thumbnailLink = thumbnailLink;
  postModel.author = authorId;

  validatePost(postModel);

  return postModel;
}

function validatePost(post) {
  const { error } = validate(post);
  if (error) {
    throw new StatusError(400, error.details[0].message);
  }
}

async function createPostInDatabase(postModel, session) {
  const tags = await Tag.findOrCreateMany(
    postModel.tags.map((name) => {
      return { name };
    }),
    session
  );
  postModel.tags = tags.map((tag) => tag._id);

  const posts = await Post.create([postModel], { session });
  post = posts[0];

  await Promise.all(tags.map((tag) => tag.addPost(post._id)));
  await session.commitTransaction();

  return post;
}

exports.create = async (req, res) => {
  const postModel = mapPostToViewModel(
    req.body,
    req.postImageURL,
    req.postThumbnailURL,
    req.user._id
  );

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await createPostInDatabase(postModel, session);
  } catch (e) {
    await session.abortTransaction();
    throw new StatusError(500, e.message);
  } finally {
    session.endSession();
    res.send(postModel);
  }
};

exports.show = async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("author", "name")
    .populate("tags")
    .populate({
      path: "comments",
      populate: { path: "author", model: "User" },
    });

  if (!post) {
    throw new StatusError(404, `Post ${req.params.id} not found`);
  }

  const sortedTags = Tag.sortByName(post.tags);
  const tagsOccurences = Tag.getOccurences(sortedTags);

  res.send({ post: post, tags: tagsOccurences, user: req.user });
};

exports.update = async (req, res) => {
  const body = miscUtils.pickAttributes(req.body, POST_BODY_ATTRIBUTES);

  // remove old tags
  let post = await Post.findById(req.params.id).populate("tags");
  if (!post) {
    throw new StatusError(404, `Post ${req.params.id} not found`);
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await Promise.all(post.tags.map((tag) => tag.removePost(post._id)));

    // add new tags
    let newPost = body;
    const tagNames = miscUtils.distinctWordsInString(newPost.tags);
    const newTags = await Tag.findOrCreateMany(
      tagNames.map((name) => {
        return { name };
      }),
      session
    );
    await Promise.all(newTags.map((tag) => tag.addPost(post._id)));
    newPost.tags = newTags.map((tag) => tag._id);

    // update post
    for (const key in newPost) {
      post[key] = newPost[key];
    }
    post.save();
    await session.commitTransaction();
  } catch (e) {
    await session.abortTransaction();
    throw new StatusError(500, e.message);
  }
  res.send(post);
};

exports.destroy = async (req, res) => {
  const post = await Post.findById(req.params.id).populate("tags");
  if (!post) {
    throw new StatusError(404, `Post ${req.params.id} not found`);
  }

  const isAuthor = authenticateAuthor(post, req.user);
  const isAdmin = req.user.roles && req.user.roles.admin;
  if (!isAuthor && !isAdmin) {
    throw new StatusError(403, "Access denied");
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await Promise.all(post.tags.map((tag) => tag.removePost(post._id)));
    await Promise.all(
      post.comments.map((commentId) =>
        Comment.findByIdAndRemove(commentId).session(session)
      )
    );
    await Post.findByIdAndRemove(post._id);

    await session.commitTransaction();
  } catch (e) {
    await session.abortTransaction();
    throw new StatusError(500, e.message);
  } finally {
    session.endSession();
    res.send(post);
  }
};

exports.toggleVote = async (req, res) => {
  let post = await Post.findById(req.params.id);
  if (!post) {
    throw new StatusError(404, `Post ${req.params.id} not found`);
  }

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

async function authenticateAuthor(post, user) {
  const author = await User.findById(post.author);

  return user._id === author._id.toString();
}
