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
  .delete("/:id", validateObjectId, authorizeUser, asyncWrapper(Comment.delete))
  .get(
    "/:id/vote-up",
    validateObjectId,
    authorizeUser,
    asyncWrapper(Comment.voteUp)
  )
  .get(
    "/:id/vote-down",
    validateObjectId,
    authorizeUser,
    asyncWrapper(Comment.voteDown)
  );

module.exports = router;
