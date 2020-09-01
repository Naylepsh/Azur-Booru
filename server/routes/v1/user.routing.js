const express = require("express");
const router = express();
const { authorizeUser } = require("../../middleware/auth.middleware");
const asyncWrapper = require("../../middleware/async-wrapper.middleware");
const validators = require("../../middleware/validators/user");
const { UserController } = require("../../controllers/user.controller");

const controller = new UserController();

router
  .post("/register", validators.register, asyncWrapper(controller.register))
  .post("/login", validators.login, asyncWrapper(controller.login))
  .get("/profile", authorizeUser, asyncWrapper(controller.profile));
module.exports = router;
