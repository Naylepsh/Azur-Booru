const express = require("express");
const router = express();
const { profile } = require("./profile.action");
const { login } = require("./login.action");
const { register } = require("./register.action");
const { authorizeUser } = require("../../middleware/auth.middleware");
const asyncWrapper = require("../../middleware/async-wrapper.middleware");
const validators = require("../../middleware/validators/user");

router
  .post("/register", validators.register, asyncWrapper(register))
  .post("/login", validators.login, asyncWrapper(login))
  .get("/profile", authorizeUser, asyncWrapper(profile));
module.exports = router;
