class StatusError extends Error {
  constructor(status, ...params) {
    super(...params);
    this.status = status;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, StatusError);
    }
  }
}

exports.StatusError = StatusError;
