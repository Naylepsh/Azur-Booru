const express = require("express");
const router = express.Router();
const { storage } = require("../../utils/storage");
const Post = require("../../controllers/post.controller");
const { authorizeUser } = require("../../middleware/auth.middleware");
const asyncWrapper = require("../../middleware/async-wrapper.middleware");
const validateObjectId = require("../../middleware/validate-object-id.middleware");
const { saveThumbnail } = require("../../middleware/save-thumbnail.middleware");
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
