const express = require('express');
const router = express.Router();
const { storage } = require('../utils/db');
const Comment = require('../controllers/commentController');
const { asyncWrapper }  = require('../middleware/route-wrappers');

router
.post('/', asyncWrapper(Comment.create))
.delete('/:id', asyncWrapper(Comment.delete))
// storage.single() has to be there due to some XMLHttpRequest form shenanigans
.post('/:id/toggle-vote', storage.single(), asyncWrapper(Comment.toggleVote));

module.exports = router;