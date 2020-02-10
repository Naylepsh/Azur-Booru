const express = require('express');
const router = express.Router();
const {storage} = require('../utils/lib/db');
const Post = require('../controllers/postController');

router
.get('/', Post.list)
.get('/new', Post.new)
.post('/', storage.single('image'), Post.create)
.get('/:id', Post.show)
.get('/:id/edit', Post.edit)
.put('/:id', Post.update)
.delete('/:id', Post.destroy);

module.exports = router;