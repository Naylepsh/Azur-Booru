const { Comment } = require('../models/comment');
const { Post } = require('../models/post');
const miscUtils = require('../utils/misc');

const COMMENTS_PER_PAGE = 10;

exports.list = async (req, res) => {
  const query = {};
  const count = await Comment.countDocuments();
  const pageInfo = miscUtils.paginationInfo(count, req.query.page, COMMENTS_PER_PAGE);

  const comments = await Comment.paginate(query, (pageInfo.currentPage - 1)*COMMENTS_PER_PAGE, COMMENTS_PER_PAGE);
  res.render('comments/index', {
    comments,
    pageInfo,
    tagsQuery: req.query.tags,
    user: req.user 
  });
}

exports.create = async (req, res) => {
  let post = await Post.findById(req.body.postId);
  if (!post) {
    return miscUtils.sendError(res, { status: 404, message: `Post with id ${req.body.postId} does not exist` });
  }

  req.body.comment.author = req.user._id;
  req.body.comment.score = 0;
  req.body.comment.post = post._id;
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