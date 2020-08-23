const express = require("express");
const router = express.Router();
const { storage } = require("../../utils/storage");
const Post = require("../../controllers/postController");
const { authorizeUser } = require("../../middleware/auth");
const asyncWrapper = require("../../middleware/asyncWrapper");
const validateObjectId = require("../../middleware/validateObjectId");
const { saveThumbnail } = require("../../middleware/save-thumbnail");
const { storeImage } = require("../../middleware/store-image.middleware");

router
  .get("/", asyncWrapper(Post.list))
  .post(
    "/",
    authorizeUser,
    storage.single("file"),
    saveThumbnail,
    storeImage,
    asyncWrapper(Post.create)
  )
  .get("/:id", validateObjectId, asyncWrapper(Post.show))
  .put("/:id", validateObjectId, authorizeUser, asyncWrapper(Post.update))
  .delete("/:id", validateObjectId, authorizeUser, asyncWrapper(Post.destroy))
  .post(
    "/:id/toggle-vote",
    validateObjectId,
    authorizeUser,
    asyncWrapper(Post.toggleVote)
  )
  .get(
    "/:id/vote-down",
    validateObjectId,
    authorizeUser,
    asyncWrapper(Post.voteDown)
  )
  .get(
    "/:id/vote-up",
    validateObjectId,
    authorizeUser,
    asyncWrapper(Post.voteUp)
  );

module.exports = router;
