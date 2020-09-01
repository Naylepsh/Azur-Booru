const { Repository } = require("./repository");
const { Post } = require("../models/post");
const { Tag } = require("../models/tag");

exports.PostRepository = class PostRepository extends Repository {
  constructor() {
    const model = Post;
    super(model);
  }

  async create(post) {
    const runInTransaction = true;
    return super.create(post, runInTransaction);
  }

  async createImpl(postData, session) {
    // move tags loading outside the repo into the service
    const tags = await Tag.findOrCreateManyByName(postData.tags, session);
    postData.tags = tags.map((tag) => tag._id);

    const posts = await Post.create([postData], { session });
    post = posts[0];

    await this.attachPostToTags(tags, post);

    return post;
  }

  attachPostToTags(tags, post) {
    return Promise.all(tags.map((tag) => tag.addPost(post._id)));
  }
};
