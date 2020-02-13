const { sendError } = require('../utils/misc');
const jwt = require('jsonwebtoken');

exports.loadUser = function(req, res, next) {
  if (!req.cookies || !req.cookies['jwt-token']) {
    return next();
  }

  try {
    const decoded = jwt.verify(req.cookies['jwt-token'], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return sendError(res, { status: 400, message: 'Invalid token.' });
  }  
}

exports.authorizeUser = function(req, res, next) {
  if (!req.cookies || !req.cookies['jwt-token']) {
    return sendError(res, { status: 401, message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(req.cookies['jwt-token'], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return sendError(res, { status: 400, message: 'Invalid token.' });
  }  
}