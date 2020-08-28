module.exports = class ForbiddenException extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.status = 403;
  }
};
