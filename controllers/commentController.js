const { Comment } = require('../models/comment');
const { Post } = require('../models/post');
const { sendError } = require('../utils/misc');

exports.create = async (req, res) => {
  let post = await Post.findById(req.body.postId);
  if (!post) {
    return sendError(res, { status: 404, message: `Post with id ${req.body.postId} does not exist` });
  }

  req.body.comment.author = req.user._id;
  const comment = await Comment.create(req.body.comment);
  post.comments.push(comment);
  await post.save();
  res.redirect(`/posts/${req.body.postId}`);
}

exports.delete = async (req, res) => {
  let post = await Post.findById(req.body.postId);
  if (!post) {
    return sendError(res, { status: 404, message: `Post with id ${req.body.postId} does not exist` });
  }

  const comment = await Comment.findByIdAndRemove(req.params.id);
  if (!comment) {
    return sendError(res, { status: 404, message: `Comment with id ${req.params.id} does not exist` });
  }

  post.comments.remove(comment);
  await post.save();
  res.redirect(`/posts/${req.body.postId}`);
}