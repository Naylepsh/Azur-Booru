const { Repository } = require("./repository");
const { Post } = require("../models/post");

exports.PostRepository = class PostRepository extends Repository {
  constructor() {
    const model = Post;
    super(model);
  }
};
