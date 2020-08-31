const express = require("express");
const router = express.Router();
const { CommentController } = require("../../controllers/comment.controller");
const asyncWrapper = require("../../middleware/async-wrapper.middleware");
const { authorizeUser } = require("../../middleware/auth.middleware");
const validateObjectId = require("../../middleware/validate-object-id.middleware");

const controller = new CommentController();

router
  .get("/", asyncWrapper(controller.list))
  .post("/", authorizeUser, asyncWrapper(controller.create))
  .get("/:id", validateObjectId, asyncWrapper(controller.show))
  .delete(
    "/:id",
    validateObjectId,
    authorizeUser,
    asyncWrapper(controller.delete)
  )
  .get(
    "/:id/vote-up",
    validateObjectId,
    authorizeUser,
    asyncWrapper(controller.voteUp)
  )
  .get(
    "/:id/vote-down",
    validateObjectId,
    authorizeUser,
    asyncWrapper(controller.voteDown)
  );

module.exports = router;
