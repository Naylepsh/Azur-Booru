const express = require("express");
const router = express.Router();
const ImageController = require("../../controllers/imageController");

router.get("/:name", ImageController.get);

module.exports = router;
