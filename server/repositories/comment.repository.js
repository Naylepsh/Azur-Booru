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

  async deleteById(id) {
    const runInTransaction = true;
    return await super.deleteById(id, runInTransaction);
  }

  async deleteByIdImpl(id) {
    const comment = await Comment.findById(id);

    const post = await Post.findById(comment.post);
    post.comments.remove(comment._id);
    await post.save();

    await Comment.findByIdAndRemove(comment._id);
  }
};
