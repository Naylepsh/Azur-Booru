const express = require('express');
const router = express.Router();
const Comment = require('../controllers/commentController');

router
.post('/', Comment.create);

module.exports = router;