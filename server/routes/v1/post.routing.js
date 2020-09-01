const express = require("express");
const router = express.Router();
const { PostController } = require("../../controllers/post.controller");
const { storage } = require("../../utils/storage");
const { authorizeUser } = require("../../middleware/auth.middleware");
const asyncWrapper = require("../../middleware/async-wrapper.middleware");
const validateObjectId = require("../../middleware/validate-object-id.middleware");
const { saveThumbnail } = require("../../middleware/save-thumbnail.middleware");
const { storeImage } = require("../../middleware/store-image.middleware");

const controller = new PostController();

router
  .get("/", asyncWrapper(controller.list))
  .post(
    "/",
    authorizeUser,
    storage.single("file"),
    saveThumbnail,
    storeImage,
    asyncWrapper(controller.create)
  )
  .get("/:id", validateObjectId, asyncWrapper(controller.show))
  .put("/:id", validateObjectId, authorizeUser, asyncWrapper(controller.update))
  .delete(
    "/:id",
    validateObjectId,
    authorizeUser,
    asyncWrapper(controller.delete)
  )
  .get(
    "/:id/vote-down",
    validateObjectId,
    authorizeUser,
    asyncWrapper(controller.voteDown)
  )
  .get(
    "/:id/vote-up",
    validateObjectId,
    authorizeUser,
    asyncWrapper(controller.voteUp)
  );

module.exports = router;
