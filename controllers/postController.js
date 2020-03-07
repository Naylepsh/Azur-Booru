const mongoose = require('mongoose');
const { Post, validate } = require('../models/post');
const { Tag } = require('../models/tag');
const { Comment } = require('../models/comment');
const { sendError, PostError } = require('../utils/error');
const miscUtils = require('../utils/misc');

const POSTS_PER_PAGE = 20;
const TAGS_PER_PAGE = 15;
const POST_BODY_ATTRIBUTES = ['source', 'title', 'tags', 'rating'];
const IMAGE_PATH = '/uploads/';
const THUMBNAIL_PATH = '/thumbnails/thumbnail_'

exports.list = async(req, res) => {
  const tagNames = miscUtils.distinctWordsInString(req.query.tags);
  const tagsInQuery = await Promise.all(tagNames.map(name => Tag.findOne({name})));
  const tagsIds = tagsInQuery.map(tag => tag._id);

  const query = tagsInQuery.length > 0 ?
    {tags: { '$all' : tagsIds }} :
    {}

  const numberOfRecords = await Post.countDocuments(query);
  const pageInfo = miscUtils.paginationInfo({numberOfRecords, 
    query: miscUtils.pickAttributes(req.query, ['tags']),
    page: req.query.page,
    recordsPerPage: POSTS_PER_PAGE
  });

  const posts = await Post.paginate(query, (pageInfo.currentPage - 1)*POSTS_PER_PAGE, POSTS_PER_PAGE);
  const tags = await Tag.popularTagsOfPosts(posts, TAGS_PER_PAGE);
  res.render('posts/index', {
    posts,
    tags,
    pageInfo,
    tagsQuery: tagNames,
    user: req.user 
  });
}

exports.new = (req, res) => {
  res.render('posts/new', { user: req.user });
}

exports.create = async (req, res) => {
  req.body.post = miscUtils.pickAttributes(req.body.post, POST_BODY_ATTRIBUTES);
  req.body.post.tags = miscUtils.distinctWordsInString(req.body.post.tags);
  const { error } = validate(req.body.post);
  if (error) { 
    return sendError(res, { status: 400, message: error.details[0].message });
  };

  miscUtils.makeThumbnail(
    `./public${IMAGE_PATH}${req.file.filename}`, 
    `./public${THUMBNAIL_PATH}${req.file.filename}`);

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const tags = await Tag.findOrCreateMany(req.body.post.tags.map(name => {
      return {name};
    }), session);
    const tagsIds = tags.map(tag => tag._id);

    const post = await Post.create([{
      imageLink: `${IMAGE_PATH}${req.file.filename}`,
      thumbnailLink: `${THUMBNAIL_PATH}${req.file.filename}`,
      source: req.body.post.source,
      tags: tagsIds,
      rating: req.body.post.rating,
      author: req.user._id,
      score: 0
    }], { session });
    await Promise.all(tags.map(tag => tag.addPost(post._id)));
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    miscUtils.removeFile(`./public${IMAGE_PATH}${req.file.filename}`);
    miscUtils.removeFile(`./public${THUMBNAIL_PATH}${req.file.filename}`);
    throw error;
  } finally {
    session.endSession();
    res.redirect('/posts');
  }
}

exports.show = async (req, res) => {
  const post = await Post.findById(req.params.id)
  .populate('author', 'name')
  .populate({
    path: 'comments',
    populate: { path: 'author', model: 'User'}
  });

  if (!post) { 
    return sendError(res, { status: 404, message: 'User not found.' });
  }

  const tags = await Promise.all(post.tags.map(async tag => {
    tag = await Tag.findById(tag._id);
    return {name: tag.name, occurences: tag.posts.length};
  }));

  res.render('posts/show', { post: post, tags: tags, user: req.user });
}

exports.edit = async (req, res) => {
  const post = await Post.findById(req.params.id).populate('tags');
  if (!post) { 
    return sendError(res, { status: 404, message: 'User not found.' });
  }

  const tagNames = post.tags.map(tag => tag.name);
  res.render('posts/edit', { post, tags: tagNames, user: req.user  });
}

exports.update = async (req, res) => {
  req.body.post = miscUtils.pickAttributes(req.body.post, POST_BODY_ATTRIBUTES);

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // remove old tags
    let oldPost = await Post.findById(req.params.id).session(session).populate('tags');
    if (!oldPost) {
      const status = 404;
      const message = 'User not found';
      throw new PostError(status, message);
    }
    await Promise.all(oldPost.tags.map(tag => tag.removePost(oldPost._id)));

    // add new tags
    let newPost = req.body.post;
    const tagNames = miscUtils.distinctWordsInString(newPost.tags);
    const newTags = await Tag.findOrCreateMany(tagNames.map(name => {
      return {name}
    }), session);
    await Promise.all(newTags.map(tag => tag.addPost(oldPost._id)));
    newPost.tags = newTags.map(tag => tag._id);
    
    // update post
    for (const key in newPost) {
      oldPost[key] = newPost[key];
    }
    await oldPost.save();
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    if (error instanceof PostError) {
      sendError(res, error);
    } else {
      throw error;
    }
  } finally {
    session.endSession();
    res.redirect(`/posts/${req.params.id}`);
  }
}

exports.destroy = async (req, res) => {
  const isAuthor = authenticateAuthor(req.user, req.params.id);
  const isAdmin = req.user.roles.admin;
  if (!isAuthor && !isAdmin) {
    return sendError(res, { status: 403, message: 'Access denied.' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const post = await Post.findByIdAndRemove(req.params.id).session(session).populate('tags');
    if (!post) {
      const status = 404;
      const message = 'Post not found.'; 
      throw new PostError(status, message);
    }
    await Promise.all(post.comments.map(commentId => Comment.findByIdAndRemove(commentId).session(session)));
    await Promise.all(post.tags.map(tag => tag.removePost(post._id)));
    await session.commitTransaction();

    miscUtils.removeFile(`./public${post.imageLink}`);
    miscUtils.removeFile(`./public${post.thumbnailLink}`);
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
    res.redirect('/posts');
  }
}

exports.toggleVote = async (req, res) => {
  let post = await Post.findById(req.params.id);
  if (!post) { 
    return sendError(res, { status: 404, message: 'Post not found.' });
  }

  if (req.body.voteType === 'up') {
    miscUtils.toggleInArray(req.user._id, post.voters.up);
    miscUtils.removeFromArrayIfExists(req.user._id, post.voters.down);
  } else if (req.body.voteType === 'down') {
    miscUtils.toggleInArray(req.user._id, post.voters.down);
    miscUtils.removeFromArrayIfExists(req.user._id, post.voters.up);
  }
  post.score = post.voters.up.length - post.voters.down.length;
  await post.save();

  res.end(post.score.toString());
}

async function authenticateAuthor(user, postId) {
  const post = await Post.findById(postId).populate('author');
  if (!post) { 
    return sendError(res, { status: 404, message: 'Post not found.' });
  }
  return user._id === post.author._id.toString()
}