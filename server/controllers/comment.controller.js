const mongoose = require("mongoose");
const { Comment } = require("../models/comment");
const { Post } = require("../models/post");
const { User } = require("../models/user");
const { toggleInArray, removeFromArrayIfExists } = require("../utils/misc");
const { getPagination } = require("../utils/pagination");
const {
  NotFoundException,
  ForbiddenException,
} = require("../utils/exceptions");

const COMMENTS_PER_PAGE = 10;

exports.list = async (req, res) => {
  const query = await parseQuery(req.query);
  const numberOfRecords = await Comment.countDocuments();
  const pageInfo = getPagination(
    numberOfRecords,
    req.query.page,
    COMMENTS_PER_PAGE
  );

  const comments = await Comment.paginate(
    query,
    (pageInfo.currentPage - 1) * COMMENTS_PER_PAGE,
    COMMENTS_PER_PAGE
  );

  res.send({
    comments,
    pageInfo,
  });
};

async function parseQuery({ body, author }) {
  const query = {};
  setCommentBodyQuery(body, query);
  await setCommentAuthorQuery(author, query);
  return query;
}

async function setCommentAuthorQuery(author, query) {
  if (author) {
    const user = await User.findOne({ name: author });
    query.author = user ? user._id : undefined;
  }
}

function setCommentBodyQuery(body, query) {
  if (body) {
    query.body = { $regex: body };
  }
}

exports.create = async ({ user, body }, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const comment = await createComment(user._id, body.postId, body.body);
    await session.commitTransaction();
    res.send(comment);
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

async function createComment(authorId, postId, commentBody) {
  const commentData = {
    author: authorId,
    post: postId,
    score: 0,
    body: commentBody,
  };
  const comment = await Comment.create(commentData);

  await addCommentToPost(postId, comment);

  return comment;
}

async function addCommentToPost(postId, comment) {
  const post = await getPost(postId);
  post.comments.push(comment);
  await post.save();
}

async function getPost(id) {
  const post = await Post.findById(id);
  if (!post) {
    const message = `Post ${id} does not exist`;
    throw new NotFoundException(message);
  }
  return post;
}

exports.show = async (req, res) => {
  const comment = await getComment(req.params.id);

  res.send(comment);
};

exports.delete = async ({ params, user }, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await deleteComment(params, user);
    await session.commitTransaction();
    res.send("Comment deleted");
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

async function deleteComment(params, user) {
  const comment = await getComment(params.id);
  ensureUserIsTheAuthor(comment, user);

  const post = await getPost(comment.post);
  post.comments.remove(comment._id);
  await post.save();

  await Comment.findByIdAndRemove(comment._id);
}

function ensureUserIsTheAuthor(comment, user) {
  if (comment.author.id !== user._id) {
    throw new ForbiddenException();
  }
}

exports.voteUp = async (req, res) => {
  const userId = req.user._id;
  const comment = await getComment(req.params.id);

  toggleInArray(userId, comment.voters.up);
  removeFromArrayIfExists(userId, comment.voters.down);
  comment.score = comment.voters.up.length - comment.voters.down.length;

  await comment.save();

  res.send({ score: comment.score });
};

exports.voteDown = async (req, res) => {
  const userId = req.user._id;
  const comment = await getComment(req.params.id);

  toggleInArray(userId, comment.voters.down);
  removeFromArrayIfExists(userId, comment.voters.up);
  comment.score = comment.voters.up.length - comment.voters.down.length;

  await comment.save();

  res.send({ score: comment.score });
};

async function getComment(id) {
  const comment = await Comment.findById(id).populate("author");
  if (!comment) {
    const message = `Comment ${id} not found`;
    throw new NotFoundException(message);
  }
  return comment;
}
