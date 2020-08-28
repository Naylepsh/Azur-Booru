const CommentService = require("../services/comment/comment.service");

exports.CommentController = class CommentController {
  constructor() {
    this.commentService = new CommentService();
  }

  list = async (req, res) => {
    const query = req.query;

    const { comments, pageInfo } = await this.commentService.findMany(query);

    res.send({
      comments,
      pageInfo,
    });
  };

  create = async (req, res) => {
    const commentDTO = {
      authorId: req.user._id,
      postId: req.body.postId,
      commentBody: req.body.body,
    };

    const comment = await this.commentService.create(commentDTO);

    res.send(comment);
  };

  show = async (req, res) => {
    const comment = await this.commentService.findById(req.params.id);

    res.send(comment);
  };

  delete = async (req, res) => {
    const id = req.params.id;
    const user = req.user;

    await this.commentService.deleteById(id, user);

    res.send("Comment deleted successfully");
  };

  voteUp = async (req, res) => {
    const userId = req.user.id;
    const commentId = req.params.id;

    const { score } = await this.commentService.voteUp(commentId, userId);

    res.send({ score });
  };

  voteDown = async (req, res) => {
    const userId = req.user.id;
    const commentId = req.params.id;

    const { score } = await this.commentService.voteDown(commentId, userId);

    res.send({ score });
  };
};
