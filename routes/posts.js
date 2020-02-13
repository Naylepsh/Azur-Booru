const express = require('express');
const router = express.Router();
const { storage } = require('../utils/db');
const Post = require('../controllers/postController');
const { authorizeUser } = require('../middleware/auth');

router
.get('/', Post.list)
.get('/new', authorizeUser, Post.new)
.post('/', authorizeUser, storage.single('image'), Post.create)
.get('/:id', Post.show)
.get('/:id/edit', authorizeUser, Post.edit)
.put('/:id', authorizeUser, Post.update)
.delete('/:id', authorizeUser, Post.destroy);

module.exports = router;