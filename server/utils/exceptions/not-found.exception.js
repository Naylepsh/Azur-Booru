module.exports = class BadRequestException extends Error {
  constructor(message = "Not Found") {
    super(message);
    this.status = 404;
  }
};
