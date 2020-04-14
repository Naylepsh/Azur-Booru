require("dotenv").config();
const config = require("./config");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const errorMiddleware = require("./middleware/error");

if (!process.env.JWT_SECRET) {
  console.error("JWT SECRET is not defined");
  process.exit(1);
}

const indexRoutes = require("./routes/landing");
const postsRoutes = require("./routes/v1.0/posts");
const userRoutes = require("./routes/v1.0/user");
const commentRoutes = require("./routes/v1.0/comments");
const errorRoutes = require("./routes/error");

// DB config
mongoose.set("useUnifiedTopology", true);
mongoose.set("useCreateIndex", true);
mongoose.connect(config.db.URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
});

// App Config
// app.set("view engine", "ejs");
app.use(express.json());
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use(methodOverride("_method"));
app.use(require("./middleware/auth").loadUser);
require("./routes/index")(app);
app.use(errorMiddleware);

module.exports = app;