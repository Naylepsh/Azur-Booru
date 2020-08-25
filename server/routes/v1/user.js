const express = require("express");
const router = express();
const User = require("../../controllers/userController");
const { authorizeUser } = require("../../middleware/auth");
const asyncWrapper = require("../../middleware/asyncWrapper");

router
  .post("/register", asyncWrapper(User.register))
  .post("/login", asyncWrapper(User.login))
  .get("/logout", User.logout)
  .get("/profile", authorizeUser, asyncWrapper(User.profile));

module.exports = router;
