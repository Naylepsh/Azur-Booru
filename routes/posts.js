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

router.put('/:id', Post.update);

router.delete('/:id', Post.destroy);

// router.delete('/:id', async (req, res) => {
//   try {
//     await Post.findByIdAndRemove(req.params.id);
//     res.redirect('/posts');
//   } catch (err) {
//     console.error(err);
//     miscUtils.sendError(req, err, 500);
//   }
// })

module.exports = router;