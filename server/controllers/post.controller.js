const { Post } = require("../models/post");
const { Tag } = require("../models/tag");
const miscUtils = require("../utils/misc");
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

exports.toggleVote = async (req, res) => {
  const post = await getPost(req.params.id);

  if (req.body.voteType === "up") {
    miscUtils.toggleInArray(req.user._id, post.voters.up);
    miscUtils.removeFromArrayIfExists(req.user._id, post.voters.down);
  } else if (req.body.voteType === "down") {
    miscUtils.toggleInArray(req.user._id, post.voters.down);
    miscUtils.removeFromArrayIfExists(req.user._id, post.voters.up);
  }
  post.score = post.voters.up.length - post.voters.down.length;
  await post.save();

  res.end(post.score.toString());
};

exports.voteUp = async (req, res) => {
  const post = await getPost(req.params.id);

  miscUtils.toggleInArray(req.user._id, post.voters.up);
  miscUtils.removeFromArrayIfExists(req.user._id, post.voters.down);
  post.score = post.voters.up.length - post.voters.down.length;
  await post.save();

  res.send(post.score.toString());
};

exports.voteDown = async (req, res) => {
  const post = await getPost(req.params.id);

  miscUtils.toggleInArray(req.user._id, post.voters.down);
  miscUtils.removeFromArrayIfExists(req.user._id, post.voters.up);
  post.score = post.voters.up.length - post.voters.down.length;
  await post.save();

  res.send(post.score.toString());
};

async function getPost(id, populateQuery) {
  const post = await Post.findById(id);
  ensurePostWasFound(post, id);
  await populatePost(populateQuery, post);
  return post;
}

async function populatePost(populateQuery, post) {
  if (populateQuery) {
    await post.populate(populateQuery).execPopulate();
  }
}

function ensurePostWasFound(post, id) {
  if (!post) {
    const message = `Post ${id} not found`;
    throw new NotFoundException(message);
  }
}
