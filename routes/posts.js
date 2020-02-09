const express = require('express');
const router = express.Router();
const dbUtils = require('../utils/lib/db');
const miscUtils =  require('../utils/lib/misc');
const Post = require('../models/post');
const Tags = require('../controllers/tags');

const IMAGES_PER_PAGE = 20;
const TAGS_PER_PAGE = 15;

router.get('/', async (req, res) => {
  try {
    const tagNames = dbUtils.parseForTags(req.query.tags);
    const tags = await Promise.all(tagNames.map(name => Tag.findOne({ name })));
    console.log(tags);
    res.json(tags);
    // const tagsDBQuery = dbUtils.getTagsDBQuery(req.query.tags);
    // const count = await Post.countDocuments(tagsDBQuery);
    // const pageInfo =  miscUtils.pageInfo(count, req.query.page, IMAGES_PER_PAGE);

    // const posts = await dbUtils.getElemsFromDB(Post, tagsDBQuery, (pageInfo.currentPage - 1)*IMAGES_PER_PAGE, IMAGES_PER_PAGE);
    // const tags = await dbUtils.getTags(posts, TAGS_PER_PAGE);

    // res.render('posts/index', {
    //   posts,
    //   tags,
    //   pageInfo,
    //   tagsQuery: req.query.tags, 
    // });

  } catch(err) {
    console.error(err);
    miscUtils.sendError(req, err, 500);
  }
});

router.get('/new', (req, res) => {
  res.render('posts/new');
});

router.post('/', dbUtils.storage.single('image'), async (req, res) => {
  try {
    await miscUtils.makeThumbnail(`./public/uploads/${req.file.filename}`, `./public/thumbnails/thumbnail_${req.file.filename}`);
    const tagNames = dbUtils.parseForTags(req.body.tags);
    console.log(tagNames);
    const tags = await Promise.all(tagNames.map(name => Tags.findOrCreate(name)));
    console.log(tags);
    res.send(tags);
    // const post = await Post.create({
    //   imageLink: `/uploads/${req.file.filename}`,
    //   thumbnailLink: `/thumbnails/thumbnail_${req.file.filename}`,
    //   source: req.body.source,
    //   title: req.body.title,
    //   tags: req.body.tags.split(' ').filter( tag => tag.length > 0)
    // });
    // res.redirect('/posts');
  } catch(err) {
    console.error(err);
    miscUtils.sendError(req, err, 500);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const tags = await dbUtils.tagsCount(post.tags);
    res.render('posts/show', {post: post, tags: tags});
  } catch(err) {
    console.error(err);
    miscUtils.sendError(req, err, 404);
  }
});

router.get('/:id/edit', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.render('posts/edit', { post });
  } catch(err) {
    console.error(err);
    miscUtils.sendError(req, err, 500);
  }
});

router.put('/:id', async (req, res) => {
  // TO-DO make image editable (will require changing form back to enctype="multipart/form-data")
  try {
    let post = req.body.post;
    post.tags = post.tags.split(' ').filter( tag => tag.length > 0);
    await Post.findByIdAndUpdate(req.params.id, post);
    res.redirect(`/posts/${req.params.id}`);
  } catch (err) {
    console.error(err);
    miscUtils.sendError(req, err, 500);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Post.findByIdAndRemove(req.params.id);
    res.redirect('/posts');
  } catch (err) {
    console.error(err);
    miscUtils.sendError(req, err, 500);
  }
})

module.exports = router;