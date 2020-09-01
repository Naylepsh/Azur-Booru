const { Post, validate } = require("../models/post");
const { Tag } = require("../models/tag");
const { Comment } = require("../models/comment");
const { User } = require("../models/user");
const { getPagination } = require("../utils/pagination");
const miscUtils = require("../utils/misc");
const mongoose = require("mongoose");
const {
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} = require("../utils/exceptions");
const { PostService } = require("../services/post/post.service");

const POSTS_PER_PAGE = 20;
const POST_BODY_ATTRIBUTES = ["source", "tags", "rating"];

const postService = new PostService();

exports.list = async (req, res) => {
  const query = req.query;

  const { posts, tags, pageInfo } = await postService.findMany(query);

  res.send({ posts, tags, pageInfo });
};

exports.create = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const postModel = mapPostToViewModel(
      req.body,
      req.imageUrl,
      req.thumbnailUrl,
      req.user._id
    );

    await createPostInDatabase(postModel, session);
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
    res.send(postModel);
  }
};

function validatePost(post) {
  const { error } = validate(post);
  if (error) {
    const message = error.details[0].message;
    throw new BadRequestException(message);
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
  const populateQuery = [
    { path: "author", select: "name" },
    { path: "tags" },
    {
      path: "comments",
      populate: { path: "author", model: "User" },
    },
  ];
  const post = await getPost(req.params.id, populateQuery);

  const sortedTags = Tag.sortByName(post.tags);
  const tagsOccurences = Tag.getOccurences(sortedTags);
  delete post.author.password;

  res.send({ post: post, tags: tagsOccurences });
};

exports.update = async (req, res) => {
  const populateQuery = [{ path: "tags" }];
  const post = await getPost(req.params.id, populateQuery);

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
    throw error;
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
  const populateQuery = [{ path: "tags" }];
  const post = await getPost(req.params.id, populateQuery);

  const isAuthor = await authenticateAuthor(post, req.user);
  const isAdmin = req.user.roles && req.user.roles.admin;
  if (!isAuthor && !isAdmin) {
    throw new ForbiddenException();
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
    throw error;
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
  const post = await getPost(req.params.id);

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
  const post = await getPost(req.params.id);

  miscUtils.toggleInArray(req.user._id, post.voters.up);
  miscUtils.removeFromArrayIfExists(req.user._id, post.voters.down);
  post.score = post.voters.up.length - post.voters.down.length;
  await post.save();

  res.send(post.score.toString());
};

exports.voteDown = async (req, res) => {
  const post = await getPost(req.params.id);

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

async function getPost(id, populateQuery) {
  const post = await Post.findById(id);
  ensurePostWasFound(post, id);
  await populatePost(populateQuery, post);
  return post;
}

async function populatePost(populateQuery, post) {
  if (populateQuery) {
    await post.populate(populateQuery).execPopulate();
  }
}

function ensurePostWasFound(post, id) {
  if (!post) {
    const message = `Post ${id} not found`;
    throw new NotFoundException(message);
  }
}
