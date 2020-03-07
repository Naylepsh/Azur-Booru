module.exports = {
  sendError: (res, err, backupCode) => {
    res.status(err.status || backupCode).json({
      message: err.message
    });
  },

  PostError: function(status, message) {
    let error = new Error(message);
    error.status = status;
    return error;
  }
}