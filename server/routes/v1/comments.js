const express = require("express");
const router = express.Router();
const { storage } = require("../../utils/storage");
const Comment = require("../../controllers/comment.controller");
const asyncWrapper = require("../../middleware/async-wrapper.middleware");
const { authorizeUser } = require("../../middleware/auth.middleware");
const validateObjectId = require("../../middleware/validate-object-id.middleware");

router
  .get("/", asyncWrapper(Comment.list))
  .post("/", authorizeUser, asyncWrapper(Comment.create))
  .get("/:id", validateObjectId, asyncWrapper(Comment.show))
  .delete("/:id", authorizeUser, asyncWrapper(Comment.delete))
  // storage.single() has to be there due to some XMLHttpRequest form shenanigans
  .post(
    "/:id/toggle-vote",
    authorizeUser,
    storage.single(),
    asyncWrapper(Comment.toggleVote)
  );

module.exports = router;
