module.exports = function (app) {
  // app.use(express.json());
  app.use(require("./landing"));
  app.use(require("./error"));

  // load apis
  app.use("/api/v1.0/posts", require("./v1.0/posts"));
  // app.use("/api/v1.0/", require("./v1.0/user"));
  app.use("/api/v1.0/comments", require("./v1.0/comments"));
};
