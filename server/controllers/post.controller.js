const { Tag } = require("../models/tag");
const { NotFoundException } = require("../utils/exceptions");
const { PostService } = require("../services/post/post.service");

const postService = new PostService();

exports.list = async (req, res) => {
  const query = req.query;

  const { posts, tags, pageInfo } = await postService.findMany(query);

  res.send({ posts, tags, pageInfo });
};

exports.create = async (req, res) => {
  const postDTO = {
    ...req.body,
    imageLink: req.imageUrl,
    thumbnailLink: req.thumbnailUrl,
    authorId: req.user._id,
  };

  const post = await postService.create(postDTO);

  res.send(post);
};

exports.show = async (req, res) => {
  const id = req.params.id;

  const post = await postService.findById(id);
  ensurePostWasFound(post, id);

  const sortedTags = Tag.sortByName(post.tags);
  const tags = Tag.getOccurences(sortedTags);

  res.send({ post, tags });
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const postDTO = req.body;

  const post = await postService.update(id, postDTO);

  res.send({ post });
};

exports.destroy = async (req, res) => {
  const id = req.params.id;
  const user = req.user;

  await postService.deleteById(id, user);

  res.send("Post successfully deleted");
};

exports.voteUp = async (req, res) => {
  const id = req.params.id;
  const userId = req.user._id;

  const score = await postService.voteUp(id, userId);

  res.send(score.toString());
};

exports.voteDown = async (req, res) => {
  const id = req.params.id;
  const userId = req.user._id;

  const score = await postService.voteDown(id, userId);

  res.send(score.toString());
};

function ensurePostWasFound(post, id) {
  if (!post) {
    const message = `Post ${id} not found`;
    throw new NotFoundException(message);
  }
}
