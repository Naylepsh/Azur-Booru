const { Repository } = require("./repository");
const { Post } = require("../models/post");
const { Tag } = require("../models/tag");
const { Comment } = require("../models/comment");

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
    const post = posts[0];

    await this.attachPostToTags(tags, post);

    return post;
  }

  async update(id, postData) {
    const runInTransaction = true;
    return super.update(id, postData, runInTransaction);
  }

  async updateImpl(id, postData, session) {
    const populate = [{ path: "tags" }];
    const post = await super.findById(id, { populate });

    await this.detachTagsFromPost(post);

    const tags = await Tag.findOrCreateManyByName(postData.tags, session);
    postData.tags = tags.map((tag) => tag._id);

    await this.attachPostToTags(tags, post);
    return await this.updatePost(post, postData);
  }

  updatePost(post, propertiesToUpdate) {
    for (const key in propertiesToUpdate) {
      post[key] = propertiesToUpdate[key];
    }
    return post.save();
  }

  attachPostToTags(tags, post) {
    return Promise.all(tags.map((tag) => tag.addPost(post._id)));
  }

  async deleteById(id) {
    const runInTransaction = true;
    return super.deleteById(id, runInTransaction);
  }

  async deleteByIdImpl(id, session) {
    const populate = [{ path: "tags" }];
    const post = await super.findById(id, { populate });

    await this.detachTagsFromPost(post);
    await this.removePostComments(post, session);
    await Post.findByIdAndRemove(post._id);
  }

  detachTagsFromPost(post) {
    // mongoose keeps a reference to session on object that was created by find()
    // thus, no reason to pass session here
    return Promise.all(post.tags.map((tag) => tag.removePost(post._id)));
  }

  removePostComments(post, session) {
    return Comment.deleteMany({ _id: { $in: post.comments } }).session(session);
  }
};
