const express = require("express");
const router = express.Router();
const { storage } = require("../../utils/storage");
const Comment = require("../../controllers/comment.controller");
const asyncWrapper = require("../../middleware/asyncWrapper");
const { authorizeUser } = require("../../middleware/auth");

router
  .get("/", asyncWrapper(Comment.list))
  .post("/", authorizeUser, asyncWrapper(Comment.create))
  .get("/:id", asyncWrapper(Comment.show))
  .delete("/:id", authorizeUser, asyncWrapper(Comment.delete))
  // storage.single() has to be there due to some XMLHttpRequest form shenanigans
  .post(
    "/:id/toggle-vote",
    authorizeUser,
    storage.single(),
    asyncWrapper(Comment.toggleVote)
  );

module.exports = router;
