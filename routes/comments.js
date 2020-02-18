const express = require('express');
const router = express.Router();
const Comment = require('../controllers/commentController');

router
.post('/', Comment.create)
.delete('/:id', Comment.delete);

module.exports = router;