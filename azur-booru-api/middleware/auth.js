const { sendError, pickAttributes } = require("../utils/misc");
const jwt = require("jsonwebtoken");
const { ROLES } = require("../models/role");
const config = require("../config");

exports.loadUser = function (req, res, next) {
  if (!req.cookies || !req.cookies["jwt-token"]) {
    return next();
  }

  try {
    const decoded = jwt.verify(
      req.cookies["jwt-token"],
      process.env.JWT_SECRET
    );
    req.user = decoded;
    const prefix = config.cookies.prefix;
    const cookieRoles = pickAttributes(
      req.cookies,
      Object.keys(ROLES).map((role) => prefix + role)
    );
    req.user.roles = {};
    for (const role in cookieRoles) {
      req.user.roles[role.slice(prefix.length)] = cookieRoles[role] === "true";
    }

    next();
  } catch (error) {
    return sendError(res, { status: 400, message: "Invalid token." });
  }
};

/**
 * Assumes that loadUser middleware is called before auth call
 */
exports.authorizeUser = function (req, res, next) {
  if (!config.requireAuth) next();
  if (!req.user) {
    return sendError(res, {
      status: 401,
      message: "Access denied. No token provided.",
    });
  }
  next();
};
