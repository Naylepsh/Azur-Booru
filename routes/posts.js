const express = require('express');
const router = express.Router();
const {storage} = require('../utils/db');
const Post = require('../controllers/postController');
const auth = require('../middleware/auth');

router
.get('/', Post.list)
.get('/new', auth, Post.new)
.post('/', auth, storage.single('image'), Post.create)
.get('/:id', Post.show)
.get('/:id/edit', auth, Post.edit)
.put('/:id', auth, Post.update)
.delete('/:id', auth, Post.destroy);

module.exports = router;