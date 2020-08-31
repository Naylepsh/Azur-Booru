const mongoose = require("mongoose");
const { Comment } = require("../models/comment");
const { Post } = require("../models/post");
const { Repository } = require("./repository");

exports.CommentRepository = class CommentRepository extends Repository {
  constructor() {
    const model = Comment;
    super(model);
  }

  async findMany(queryParams, options = {}) {
    return await super.findMany(queryParams, options);
  }

  async create(commentData) {
    const runInTransaction = true;
    return await super.create(commentData, runInTransaction);
  }

  async createImpl(commentData) {
    const comment = await Comment.create(commentData);

    await this.addCommentToPost(comment.post, comment);

    return comment;
  }

  async addCommentToPost(postId, comment) {
    const post = await Post.findById(postId);
    post.comments.push(comment);
    await post.save();
  }

  async findById(id, options = {}) {
    let query = Comment.findById(id);

    if (options.populate) {
      for (const populateOptions of options.populate) {
        query = query.populate(populateOptions);
      }
    }

    const comment = await query.exec();

    return comment;
  }

  async deleteById(id) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await this.deleteComment(id);
      await session.commitTransaction();
      session.endSession();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async deleteComment(id) {
    const comment = await Comment.findById(id);

    const post = await Post.findById(comment.post);
    post.comments.remove(comment._id);
    await post.save();

    await Comment.findByIdAndRemove(comment._id);
  }
};
