const express = require("express");
const router = express.Router();
const { storage } = require("../../utils/storage");
const Post = require("../../controllers/postController");
const { authorizeUser } = require("../../middleware/auth");
const { asyncWrapper } = require("../../middleware/route-wrappers");
const {
  uploadImageToGCS,
  prepareThumbnail,
  uploadThumbnailToGCS,
} = require("../../middleware/google-cloud-storage");

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
  .get("/:id", asyncWrapper(Post.show))
  .put("/:id", authorizeUser, asyncWrapper(Post.update))
  .delete("/:id", authorizeUser, asyncWrapper(Post.destroy))
  .post("/:id/toggle-vote", authorizeUser, asyncWrapper(Post.toggleVote));

module.exports = router;
