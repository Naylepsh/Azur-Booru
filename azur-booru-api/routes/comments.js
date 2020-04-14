const express = require("express");
const router = express.Router();
const { storage } = require("../utils/storage");
const Comment = require("../controllers/commentController");
const { asyncWrapper } = require("../middleware/route-wrappers");

router
  .get("/", asyncWrapper(Comment.list))
  .get("/search", Comment.search)
  .post("/", asyncWrapper(Comment.create))
  .delete("/:id", asyncWrapper(Comment.delete))
  // storage.single() has to be there due to some XMLHttpRequest form shenanigans
  .post("/:id/toggle-vote", storage.single(), asyncWrapper(Comment.toggleVote));

module.exports = router;
