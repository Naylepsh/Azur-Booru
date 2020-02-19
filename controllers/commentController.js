const { Comment } = require('../models/comment');
const { Post } = require('../models/post');
const miscUtils = require('../utils/misc');

exports.create = async (req, res) => {
  let post = await Post.findById(req.body.postId);
  if (!post) {
    return miscUtils.sendError(res, { status: 404, message: `Post with id ${req.body.postId} does not exist` });
  }

  req.body.comment.author = req.user._id;
  req.body.comment.score = 0;
  const comment = await Comment.create(req.body.comment);
  post.comments.push(comment);
  await post.save();
  res.redirect(`/posts/${req.body.postId}`);
}

exports.delete = async (req, res) => {
  let post = await Post.findById(req.body.postId);
  if (!post) {
    return miscUtils.sendError(res, { status: 404, message: `Post with id ${req.body.postId} does not exist` });
  }

  const comment = await Comment.findByIdAndRemove(req.params.id);
  if (!comment) {
    return miscUtils.sendError(res, { status: 404, message: `Comment with id ${req.params.id} does not exist` });
  }

  post.comments.remove(comment);
  await post.save();
  res.redirect(`/posts/${req.body.postId}`);
}

exports.toggleVote = async (req, res) => {
  let comment = await Comment.findById(req.params.id);
  if (!comment) { 
    return miscUtils.sendError(res, { status: 404, message: 'Post not found.' });
  }

  if (req.body.voteType === 'up') {
    miscUtils.toggleInArray(req.user._id, comment.voters.up);
    miscUtils.removeFromArrayIfExists(req.user._id, comment.voters.down);
  } else if (req.body.voteType === 'down') {
    miscUtils.toggleInArray(req.user._id, comment.voters.down);
    miscUtils.removeFromArrayIfExists(req.user._id, comment.voters.up);
  }
  comment.score = comment.voters.up.length - comment.voters.down.length;
  await comment.save();

  res.end(comment.score.toString());
}