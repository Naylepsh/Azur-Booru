const { sendError, pickAttributes } = require("../utils/misc");
const jwt = require("jsonwebtoken");
const { ROLES } = require("../models/role");
const config = require("../config");

exports.authorizeUser = function (req, res, next) {
  if (!config.requireAuth) return next();

  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  console.log("req:", req.body);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};
