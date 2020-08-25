module.exports = (err, req, res, next) => {
  const { status, message } = err;
  console.log(err.message);
  res.status(status).send(message);
};
