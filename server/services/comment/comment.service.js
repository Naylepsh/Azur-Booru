const mongoose = require("mongoose");
const { User } = require("../../models/user");
const { Comment } = require("../../models/comment");
const { Post } = require("../../models/post");
const { getPagination } = require("../../utils/pagination");
const {
  NotFoundException,
  ForbiddenException,
} = require("../../utils/exceptions");
const { toggleInArray, removeFromArrayIfExists } = require("../../utils/misc");
const { CommentRepository } = require("../../repositories/comment.repository");

module.exports = class CommentService {
  COMMENTS_PER_PAGE = 10;

  constructor() {
    this.repository = new CommentRepository();
  }

  async findMany({ body, author, page }) {
    const query = await this.parseQuery({ body, author });
    const numberOfRecords = await Comment.countDocuments();
    const pageInfo = getPagination(
      numberOfRecords,
      page,
      this.COMMENTS_PER_PAGE
    );

    const queryOptions = {
      sort: { _id: -1 },
      skip: (pageInfo.currentPage - 1) * this.COMMENTS_PER_PAGE,
      limit: this.COMMENTS_PER_PAGE,
      populate: [{ path: "author" }, { path: "post" }],
    };
    const comments = await this.repository.findMany(query, queryOptions);

    return { comments, pageInfo };
  }

  async parseQuery({ body, author }) {
    const query = {};
    this.setCommentBodyQuery(body, query);
    await this.setCommentAuthorQuery(author, query);
    return query;
  }

  async setCommentAuthorQuery(author, query) {
    if (author) {
      const user = await User.findOne({ name: author });
      query.author = user ? user._id : undefined;
    }
  }

  setCommentBodyQuery(body, query) {
    if (body) {
      query.body = { $regex: body };
    }
  }

  async create({ authorId, postId, commentBody }) {
    // move existence check to middleware?
    const post = await Post.findById(postId);
    if (!post) {
      const message = "Post doesnt exist";
      throw new NotFoundException(message);
    }

    const commentData = {
      author: authorId,
      post: postId,
      score: 0,
      body: commentBody,
    };

    const comment = await this.repository.create(commentData);

    return comment;
  }

  async findById(id) {
    const populate = [{ path: "author" }];

    const comment = await this.repository.findById(id, { populate });
    this.ensureCommentWasFound(comment, id);

    return comment;
  }

  ensureCommentWasFound(comment, id) {
    if (!comment) {
      const message = `Comment ${id} not found`;
      throw new NotFoundException(message);
    }
  }

  async deleteById(id, user) {
    const comment = await this.findById(id);
    this.ensureUserIsTheAuthor(comment, user);

    await this.repository.deleteById(id);
  }

  ensureUserIsTheAuthor(comment, user) {
    if (comment.author._id.toString() !== user._id.toString()) {
      throw new ForbiddenException();
    }
  }

  async voteUp(commentId, userId) {
    const comment = await this.repository.findById(commentId);
    this.ensureCommentWasFound(comment, commentId);

    toggleInArray(userId, comment.voters.up);
    removeFromArrayIfExists(userId, comment.voters.down);
    comment.score = comment.voters.up.length - comment.voters.down.length;

    await comment.save();

    return comment._doc;
  }

  async voteDown(commentId, userId) {
    const comment = await this.repository.findById(commentId);
    this.ensureCommentWasFound(comment, commentId);

    toggleInArray(userId, comment.voters.down);
    removeFromArrayIfExists(userId, comment.voters.up);
    comment.score = comment.voters.up.length - comment.voters.down.length;

    await comment.save();

    return comment._doc;
  }
};
