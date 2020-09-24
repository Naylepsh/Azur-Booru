const { Tag } = require("../models/tag");
const { NotFoundException } = require("../utils/exceptions");
const { PostService } = require("../services/post/post.service");

exports.PostController = class PostController {
  constructor() {
    this.postService = new PostService();
  }

  list = async (req, res) => {
    const query = req.query;

    const { posts, tags, pageInfo } = await this.postService.findMany(query);

    res.send({ posts, tags, pageInfo });
  };

  create = async (req, res) => {
    // Due to passing data with FormData, tags cannot be passed as an array
    // thus the conversion from 'tag1,tag2,...' to ['tag1', 'tag2', ....]
    const tags = req.body.tags.split(",");
    const postDTO = {
      ...req.body,
      tags,
      imageLink: req.imageUrl,
      thumbnailLink: req.thumbnailUrl,
      authorId: req.user._id,
    };

    const post = await this.postService.create(postDTO);

    res.send(post);
  };

  show = async (req, res) => {
    const id = req.params.id;

    const post = await this.postService.findById(id);
    this.ensurePostWasFound(post, id);

    const sortedTags = Tag.sortByName(post.tags);
    const tags = Tag.getOccurences(sortedTags);

    res.send({ post, tags });
  };

  update = async (req, res) => {
    const id = req.params.id;
    const postDTO = req.body;

    const post = await this.postService.update(id, postDTO);

    res.send({ post });
  };

  delete = async (req, res) => {
    const id = req.params.id;
    const user = req.user;

    await this.postService.deleteById(id, user);

    res.send("Post successfully deleted");
  };

  voteUp = async (req, res) => {
    const id = req.params.id;
    const userId = req.user._id;

    const score = await this.postService.voteUp(id, userId);

    res.send(score.toString());
  };

  voteDown = async (req, res) => {
    const id = req.params.id;
    const userId = req.user._id;

    const score = await this.postService.voteDown(id, userId);

    res.send(score.toString());
  };

  ensurePostWasFound(post, id) {
    if (!post) {
      const message = `Post ${id} not found`;
      throw new NotFoundException(message);
    }
  }
};
