const express = require("express");
const router = express.Router();
const { storage } = require("../../utils/storage");
const Post = require("../../controllers/postController");
const { authorizeUser } = require("../../middleware/auth");
const asyncWrapper = require("../../middleware/asyncWrapper");
const {
  uploadImageToGCS,
  prepareThumbnail,
  uploadThumbnailToGCS,
} = require("../../middleware/google-cloud-storage");
const validateObjectId = require("../../middleware/validateObjectId");

router
  .get("/", asyncWrapper(Post.list))
  .post(
    "/",
    authorizeUser,
    storage.single("file"),
    uploadImageToGCS,
    prepareThumbnail,
    uploadThumbnailToGCS,
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
    "/:id/vote-up",
    validateObjectId,
    authorizeUser,
    asyncWrapper(Post.voteUp)
  );

module.exports = router;
