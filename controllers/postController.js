const { Post, validate } = require('../models/post');
const Tag = require('../models/tag');
const miscUtils = require('../utils/misc');

const POSTS_PER_PAGE = 20;
const TAGS_PER_PAGE = 15;
const POST_BODY_ATTRIBUTES = ['source', 'title', 'tags', 'rating'];
const IMAGE_PATH = '/uploads/';
const THUMBNAIL_PATH = '/thumbnails/thumbnail_'

exports.list = async(req, res) => {
  try {
    const tagNames = miscUtils.distinctWordsInString(req.query.tags);
    const tagsInQuery = await Promise.all(tagNames.map(name => Tag.findOrCreate(name)));
    const tagsIds = tagsInQuery.map(tag => tag._id);

    const query = tagsInQuery.length > 0 ?
      {tags: { '$all' : tagsIds }} :
      {}

    const count = await Post.countDocuments(query);
    const pageInfo = miscUtils.paginationInfo(count, req.query.page, POSTS_PER_PAGE);

    const posts = await Post.paginate(query, (pageInfo.currentPage - 1)*POSTS_PER_PAGE, POSTS_PER_PAGE);
    const tags = await Tag.popularTagsOfPosts(posts, TAGS_PER_PAGE);
    res.render('posts/index', {
      posts,
      tags,
      pageInfo,
      tagsQuery: req.query.tags,
      user: req.user 
    });
  } catch (err) {
    miscUtils.sendError(res, err, 500);
  }
}

exports.new = (req, res) => {
  res.render('posts/new', { user: req.user });
}

exports.create = async (req, res) => {
  try {
    req.body.post = miscUtils.pickAttributes(req.body.post, POST_BODY_ATTRIBUTES);
    req.body.post.tags = miscUtils.distinctWordsInString(req.body.post.tags);
    const { error } = validate(req.body.post);
    if (error) { 
      return miscUtils.sendError(res, { status: 400, message: error.details[0].message });
    };

    miscUtils.makeThumbnail(
      `./public${IMAGE_PATH}${req.file.filename}`, 
      `./public${THUMBNAIL_PATH}${req.file.filename}`);
    const tags = await Promise.all(req.body.post.tags.map(name => Tag.findOrCreate(name)));
    const tagsIds = tags.map(tag => tag._id);

    const post = await Post.create({
      imageLink: `${IMAGE_PATH}${req.file.filename}`,
      thumbnailLink: `${THUMBNAIL_PATH}${req.file.filename}`,
      source: req.body.post.source,
      tags: tagsIds,
      rating: req.body.post.rating
    });
    await Promise.all(tagsIds.map( id => Tag.addPost(id, post._id)));
    res.redirect('/posts');
  } catch (err) {
    miscUtils.removeFile(`./public${IMAGE_PATH}${req.file.filename}`);
    miscUtils.removeFile(`./public${THUMBNAIL_PATH}${req.file.filename}`);
    console.error(err);
    miscUtils.sendError(res, err, 500);
  }
}

exports.show = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) { 
      return miscUtils.sendError(res, { status: 404, message: 'User not found.' });
    }

    const tags = await Promise.all(post.tags.map(async tag => {
      tag = await Tag.findById(tag._id)
      return {name: tag.name, occurences: tag.posts.length};
    }));
    res.render('posts/show', { post: post, tags: tags, user: req.user });
  } catch(err) {
    console.error(err);
    miscUtils.sendError(res, err, 500);
  }
}

exports.edit = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('tags');
    if (!post) { 
      return miscUtils.sendError(res, { status: 404, message: 'User not found.' });
    }

    const tagNames = post.tags.map(tag => tag.name);
    res.render('posts/edit', { post, tags: tagNames, user: req.user  });
  } catch(err) {
    console.error(err);
    miscUtils.sendError(res, err, 500);
  }
}

exports.update = async (req, res) => {
  try {
    req.body.post = miscUtils.pickAttributes(req.body.post, POST_BODY_ATTRIBUTES);
    
    // remove old tags
    let oldPost = await Post.findById(req.params.id).populate('tags');
    if (!oldPost) { 
      return miscUtils.sendError(res, { status: 404, message: 'User not found.' });
    }
    await Promise.all(oldPost.tags.map( tag => Tag.removePost(tag._id, oldPost._id)));

    // add new tags
    let newPost = req.body.post;
    const newTags = await Promise.all(
      miscUtils
      .distinctWordsInString(newPost.tags)
      .map(tagName => Tag.findOrCreate(tagName)));
    await Promise.all(newTags.map(tag => Tag.addPost(tag._id, oldPost._id)));
    newPost.tags = newTags.map(tag => tag._id);
    
    // update post
    for (const key in newPost) {
      oldPost[key] = newPost[key];
    }
    oldPost.save();

    res.redirect(`/posts/${req.params.id}`);
  } catch (err) {
    console.error(err);
    miscUtils.sendError(res, err, 500);
  }
}

exports.destroy = async (req, res) => {
  try {
    const post = await Post.findByIdAndRemove(req.params.id);
    if (!post) { 
      return miscUtils.sendError(res, { status: 404, message: 'User not found.' });
    }

    await Promise.all(post.tags.map(tag => Tag.removePost(tag._id, post._id)));
    miscUtils.removeFile(`./public${post.imageLink}`);
    miscUtils.removeFile(`./public${post.thumbnailLink}`);
    res.redirect('/posts');
  } catch (err) {
    console.error(err);
    miscUtils.sendError(res, err, 500);
  }
}