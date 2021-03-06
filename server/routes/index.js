module.exports = function (app) {
  app.use("/api/v1/posts", require("./v1/post.routing"));
  app.use("/api/v1/users", require("./v1/user.routing"));
  app.use("/api/v1/comments", require("./v1/comment.routing"));
  app.use("/api/v1/images", require("./v1/images"));
};
