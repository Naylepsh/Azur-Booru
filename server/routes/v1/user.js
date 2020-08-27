const express = require("express");
const router = express();
const User = require("../../controllers/user.controller");
const { authorizeUser } = require("../../middleware/auth");
const asyncWrapper = require("../../middleware/asyncWrapper");

router
  .post("/register", asyncWrapper(User.register))
  .post("/login", asyncWrapper(User.login))
  .get("/profile", authorizeUser, asyncWrapper(User.profile));

module.exports = router;
