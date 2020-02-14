const express = require('express');
const router = express.Router();
const { storage } = require('../utils/db');
const Post = require('../controllers/postController');
const { authorizeUser } = require('../middleware/auth');
const { asyncWrapper }  = require('../middleware/route-wrappers');

router
.get('/', asyncWrapper(Post.list))
.get('/new', authorizeUser, Post.new)
.post('/', authorizeUser, storage.single('image'), asyncWrapper(Post.create))
.get('/:id', asyncWrapper(Post.show))
.get('/:id/edit', authorizeUser, asyncWrapper(Post.edit))
.put('/:id', authorizeUser, asyncWrapper(Post.update))
.delete('/:id', authorizeUser, asyncWrapper(Post.destroy));

module.exports = router;