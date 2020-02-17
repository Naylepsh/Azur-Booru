const express = require('express');
const router = express.Router();
const Comment = require('../controllers/commentController');

router
.post('/posts/:id/comments', Comment.create);

module.exports = router;