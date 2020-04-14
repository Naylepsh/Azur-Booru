const express = require("express");
const router = express();
const User = require("../../controllers/userController");
const { authorizeUser } = require("../../middleware/auth");
const { asyncWrapper } = require("../../middleware/route-wrappers");

router
  .get("/register", User.registerForm)
  .post("/register", asyncWrapper(User.register))
  .get("/login", User.loginForm)
  .post("/login", asyncWrapper(User.login))
  .get("/logout", User.logout)
  .get("/profile", authorizeUser, asyncWrapper(User.profile));

module.exports = router;
