const { Comment } = require("../models/comment");

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
};
