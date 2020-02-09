const express = require('express');
const router = express.Router();
const dbUtils = require('../utils/lib/db');
const miscUtils =  require('../utils/lib/misc');
// const Post = require('../models/post');
const Tags = require('../controllers/tagController');
const Post = require('../controllers/postController');

router.get('/', Post.list);

router.get('/new', Post.new);

router.post('/', dbUtils.storage.single('image'), Post.create);

router.get('/:id', Post.show);

router.get('/:id/edit', Post.edit);

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