module.exports = class BadRequestException extends Error {
  constructor(message = "Bad Request") {
    super(message);
    this.status = 400;
  }
};
