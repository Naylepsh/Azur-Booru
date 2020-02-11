const Post = require('../models/post');
const Tag = require('../models/tag');
const miscUtils = require('../utils/misc');

const POSTS_PER_PAGE = 20;
const TAGS_PER_PAGE = 15;

exports.list = async(req, res, next) => {
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
    });
  } catch (err) {
    console.error(err);
  }
}

exports.new = (req, res) => {
  res.render('posts/new');
}

exports.create = async (req, res) => {
  try {
    miscUtils.makeThumbnail(`./public/uploads/${req.file.filename}`, `./public/thumbnails/thumbnail_${req.file.filename}`);
    const tagNames = miscUtils.distinctWordsInString(req.body.tags);
    const tags = await Promise.all(tagNames.map(name => Tag.findOrCreate(name)));
    const tagsIds = tags.map(tag => tag._id);

    const post = await Post.create({
      imageLink: `/uploads/${req.file.filename}`,
      thumbnailLink: `/thumbnails/thumbnail_${req.file.filename}`,
      source: req.body.source,
      title: req.body.title,
      tags: tagsIds,
      rating: req.body.rating
    });
    await Promise.all(tagsIds.map( id => Tag.addPost(id, post._id)));
    res.redirect('/posts');
  } catch (err) {
    console.error(err);
    miscUtils.sendError(res, err, 500);
  }
}

exports.show = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    const tags = await Promise.all(post.tags.map(async tag => {
      tag = await Tag.findById(tag._id)
      return {name: tag.name, occurences: tag.posts.length};
    }));
    res.render('posts/show', {post: post, tags: tags});
  } catch(err) {
    console.error(err);
    miscUtils.sendError(res, err, 404);
  }
}

exports.edit = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('tags');
    const tags = post.tags.map(tag => tag.name);
    res.render('posts/edit', { post, tags });
  } catch(err) {
    console.error(err);
    miscUtils.sendError(res, err, 500);
  }
}

exports.update = async (req, res) => {
  /**
   * TO-DO:
   *   make image editable (will require changing form back to enctype="multipart/form-data")
   */
  try {
    // remove old tags
    let oldPost = await Post.findById(req.params.id);
    let oldTags = await Promise.all(oldPost.tags.map(tag => Tag.findById(tag._id)));
    let oldTagsIds = oldTags.map(tag => tag._id);

    await Promise.all(oldTagsIds.map( id => Tag.removePost(id, oldPost._id)));

    // add new tags
    let newPost = req.body.post;
    const newTags = await Promise.all(
      miscUtils
      .distinctWordsInString(newPost.tags)
      .map(tagName => Tag.findOrCreate(tagName)));
    await Promise.all(newTags.map(tag => Tag.addPost(tag._id, oldPost._id)));
    newPost.tags = newTags.map(tag => tag._id);
    
    // update post
    for (const key in oldPost) {
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
    await Promise.all(post.tags.map(tag => Tag.removePost(tag._id, post._id)));
    res.redirect('/posts');
  } catch (err) {
    console.error(err);
    miscUtils.sendError(res, err, 500);
  }
}