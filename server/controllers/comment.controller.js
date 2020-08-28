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
  const userId = req.user.id;
  const commentId = req.params.id;

  const { score } = await commentService.voteUp(commentId, userId);

  res.send({ score });
};

exports.voteDown = async (req, res) => {
  const userId = req.user.id;
  const commentId = req.params.id;

  const { score } = await commentService.voteDown(commentId, userId);

  res.send({ score });
};
