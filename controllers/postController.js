const Post = require('../models/post');
const Tag = require('../models/tag');
const miscUtils = require('../utils/lib/misc');

const POSTS_PER_PAGE = 20;
const TAGS_PER_PAGE = 15;

exports.list = async(req, res, next) => {
  try {
    const tagNames = miscUtils.getWordsFromString(req.query.tags);
    const tagsInQuery = await Promise.all(tagNames.map(name => Tag.findOrCreate(name)));

    const query = tagsInQuery.length > 0 ?
      {tags: { '$all' : tagsInQuery.map(tag => tag._id) }} :
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
    const tagNames = miscUtils.getWordsFromString(req.body.tags);
    console.log('tagNames', tagNames);
    const tags = await Promise.all(tagNames.map(name => Tag.findOrCreate(name)));
    const tagsIds = tags.map(tag => tag._id);
    console.log('tagsIDs:', tagsIds);
    const post = await Post.create({
      imageLink: `/uploads/${req.file.filename}`,
      thumbnailLink: `/thumbnails/thumbnail_${req.file.filename}`,
      source: req.body.source,
      title: req.body.title,
      tags: tagsIds
    });
    await Promise.all(tagsIds.map( id => Tag.addPost(id, post._id)));
    res.send(post);
  } catch (err) {
    console.error(err);
  }
}

exports.show = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('tags');
    const tags = await Promise.all(post.tags.map(async tag => {
      tag = await Tag.findById(tag._id)
      return {name: tag.name, occurences: tag.posts.length};
    }));
    res.render('posts/show', {post: post, tags: tags});
  } catch(err) {
    console.error(err);
    miscUtils.sendError(req, err, 404);
  }
}

exports.edit = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('tags');
    const tags = post.tags.map(tag => tag.name);
    res.render('posts/edit', { post, tags });
  } catch(err) {
    console.error(err);
    miscUtils.sendError(req, err, 500);
  }
}