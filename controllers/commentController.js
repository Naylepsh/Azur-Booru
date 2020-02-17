const { Comment } = require('../models/comment');
const { Post } = require('../models/post');
const { sendError } = require('../utils/misc');

exports.create = async (req, res) => {
  let post = await Post.findById(req.params.id);
  if (!post) {
    return sendError(res, { status: 404, message: `Post with id ${req.params.id} does not exist` });
  }

  req.body.comment.author = req.user._id;
  const comment = await Comment.create(req.body.comment);
  post.comments.push(comment);
  await post.save();
  res.redirect(`/posts/${req.params.id}`);
}