const mongoose = require("mongoose");
const { Comment } = require("../models/comment");
const { Post } = require("../models/post");
const { toggleInArray, removeFromArrayIfExists } = require("../utils/misc");
const {
  NotFoundException,
  ForbiddenException,
} = require("../utils/exceptions");
const CommentService = require("../services/comment/comment.service");

const commentService = new CommentService();

exports.list = async (req, res) => {
  const query = req.query;

  const { comments, pageInfo } = await commentService.findMany(query);

  res.send({
    comments,
    pageInfo,
  });
};

exports.create = async (req, res) => {
  const commentDTO = {
    authorId: req.user._id,
    postId: req.body.postId,
    commentBody: req.body.body,
  };

  const comment = await commentService.create(commentDTO);

  res.send(comment);
};

async function getPost(id) {
  const post = await Post.findById(id);
  if (!post) {
    const message = `Post ${id} does not exist`;
    throw new NotFoundException(message);
  }
  return post;
}

exports.show = async (req, res) => {
  const comment = await commentService.findById(req.params.id);

  res.send(comment);
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  const user = req.user;

  await commentService.deleteById(id, user);

  res.send("Comment deleted successfully");
};

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
