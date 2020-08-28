// require("dotenv").config(); // moved to config.js, commenting out in case of future removal of this line from config.js
const config = require("./config");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const errorMiddleware = require("./middleware/error.middleware");
const cors = require("cors");

if (!process.env.JWT_SECRET) {
  console.error("JWT SECRET is not defined");
  process.exit(1);
}

// DB config
mongoose.set("useUnifiedTopology", true);
mongoose.set("useCreateIndex", true);
mongoose.connect(config.db.URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
});

// App Config
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use(methodOverride("_method"));
require("./routes/index")(app);
app.use(errorMiddleware);

module.exports = app;
