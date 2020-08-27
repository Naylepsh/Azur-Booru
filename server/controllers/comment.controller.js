const mongoose = require("mongoose");
const { Comment } = require("../models/comment");
const { Post } = require("../models/post");
const { User } = require("../models/user");
const { StatusError } = require("../utils/errors");
const miscUtils = require("../utils/misc");
const { getPagination } = require("../utils/pagination");

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

async function setCommentAuthorQuery(author, mainQuery) {
  if (author) {
    const user = await User.findOne({ name: author });
    mainQuery.author = user ? user._id : undefined;
  }
}

function setCommentBodyQuery(body, mainQuery) {
  if (body) {
    mainQuery.body = { $regex: body };
  }
}

exports.create = async (req, res) => {
  const authorId = req.user._id;
  const { postId, body } = req.body;
  const post = await Post.findById(req.body.postId);
  if (!post) {
    throw new StatusError(404, `Post ${req.params.id} not found`);
  }

  const commentData = {
    author: authorId,
    post: postId,
    score: 0,
    body,
  };

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const comment = await Comment.create(commentData);
    post.comments.push(comment);
    await post.save();
    await session.commitTransaction();
    res.send(comment);
  } catch (e) {
    await session.abortTransaction();
    throw new StatusError(500, e.message);
  } finally {
    session.endSession();
  }
};

exports.show = async (req, res) => {
  const comment = await Comment.findById(req.params.id).populate("author");
  if (!comment) {
    throw new StatusError(404, `Comment ${req.params.id} not found`);
  }

  res.send(comment);
};

exports.delete = async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    throw new StatusError(404, `Comment ${req.params.id} not found`);
  }

  const post = await Post.findById(comment.post);
  if (!post) {
    throw new StatusError(404, `Post ${comment.post} not found`);
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    post.comments.remove(comment._id);
    await post.save();
    await Comment.findByIdAndRemove(comment._id);
    await session.commitTransaction();
  } catch (e) {
    await session.abortTransaction();
    throw new StatusError(500, e.message);
  } finally {
    session.endSession();
    res.send(post);
    // res.redirect(`/posts/${req.body.postId}`);
  }
};

exports.toggleVote = async (req, res) => {
  const voteType = req.body.voteType;
  const userId = req.user._id;
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    throw new StatusError(404, `Comment ${req.params.id} not found`);
  }

  if (voteType === "up") {
    miscUtils.toggleInArray(userId, comment.voters.up);
    miscUtils.removeFromArrayIfExists(userId, comment.voters.down);
  } else if (voteType === "down") {
    miscUtils.toggleInArray(userId, comment.voters.down);
    miscUtils.removeFromArrayIfExists(userId, comment.voters.up);
  }
  comment.score = comment.voters.up.length - comment.voters.down.length;
  await comment.save();

  res.send(comment.score.toString());
};
