const mongoose = require("mongoose");
const { Comment } = require("../models/comment");
const { Post } = require("../models/post");

exports.CommentRepository = class CommentRepository {
  async findMany(queryParams, options) {
    let query = Comment.find(queryParams);

    if (options.sort) {
      query = query.sort(options.sort);
    }

    if (options.skip) {
      query = query.skip(options.skip);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.populate) {
      for (const populateOptions of options.populate) {
        query = query.populate(populateOptions);
      }
    }

    const comments = await query.exec();

    return comments;
  }

  async create(commentData) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const comment = await this.createComment(commentData);
      await session.commitTransaction();
      session.endSession();
      return comment;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async createComment(commentData) {
    const comment = await Comment.create(commentData);

    await this.addCommentToPost(comment.post, comment);

    return comment;
  }

  async addCommentToPost(postId, comment) {
    const post = await Post.findById(postId);
    post.comments.push(comment);
    await post.save();
  }

  async findById(id, options) {
    let query = Comment.findById(id);

    if (options.populate) {
      for (const populateOptions of options.populate) {
        query = query.populate(populateOptions);
      }
    }

    const comment = await query.exec();

    return comment;
  }
};
