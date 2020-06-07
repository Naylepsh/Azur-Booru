module.exports = function (app) {
  app.use("/api/v1/posts", require("./v1/posts"));
  app.use("/api/v1/users", require("./v1/user"));
  app.use("/api/v1/comments", require("./v1/comments"));
};
