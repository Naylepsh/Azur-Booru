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

    // const comments = await Comment.paginate(
    //   query,
    //   (pageInfo.currentPage - 1) * this.COMMENTS_PER_PAGE,
    //   this.COMMENTS_PER_PAGE
    // );
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
    let comment;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      comment = await this.createComment(authorId, postId, commentBody);
      await session.commitTransaction();
      session.endSession();
      return comment;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async createComment(authorId, postId, commentBody) {
    const commentData = {
      author: authorId,
      post: postId,
      score: 0,
      body: commentBody,
    };
    const comment = await Comment.create(commentData);

    await this.addCommentToPost(postId, comment);

    return comment;
  }

  async addCommentToPost(postId, comment) {
    const post = await this.getPost(postId);
    post.comments.push(comment);
    await post.save();
  }

  async findById(id) {
    const populateQuery = [{ path: "author" }];

    const comment = await this.getComment(id, populateQuery);

    return comment;
  }

  async deleteById(id, user) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await this.deleteComment(id, user);
      await session.commitTransaction();
      session.endSession();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async deleteComment(id, user) {
    const comment = await this.getComment(id);
    this.ensureUserIsTheAuthor(comment, user);

    const post = await this.getPost(comment.post);
    post.comments.remove(comment._id);
    await post.save();

    await Comment.findByIdAndRemove(comment._id);
  }

  ensureUserIsTheAuthor(comment, user) {
    if (comment.author._id.toString() !== user._id.toString()) {
      throw new ForbiddenException();
    }
  }

  async voteUp(commentId, userId) {
    const comment = await this.getComment(commentId);

    toggleInArray(userId, comment.voters.up);
    removeFromArrayIfExists(userId, comment.voters.down);
    comment.score = comment.voters.up.length - comment.voters.down.length;

    await comment.save();

    return comment._doc;
  }

  async voteDown(commentId, userId) {
    const comment = await this.getComment(commentId);

    toggleInArray(userId, comment.voters.down);
    removeFromArrayIfExists(userId, comment.voters.up);
    comment.score = comment.voters.up.length - comment.voters.down.length;

    await comment.save();

    return comment._doc;
  }

  async getComment(id, populateQuery) {
    const comment = await Comment.findById(id);
    this.ensureCommentWasFound(comment, id);
    await this.populateComment(comment, populateQuery);
    return comment;
  }

  ensureCommentWasFound(comment, id) {
    if (!comment) {
      const message = `Comment ${id} not found`;
      throw new NotFoundException(message);
    }
  }

  async populateComment(comment, populateQuery) {
    if (populateQuery) {
      await comment.populate(populateQuery).execPopulate();
    }
  }

  async getPost(id) {
    const post = await Post.findById(id);
    if (!post) {
      const message = `Post ${id} does not exist`;
      throw new NotFoundException(message);
    }
    return post;
  }
};
