const { upload_path } = require("../utils/storage");

exports.get = function (req, res) {
  const name = req.params.name;
  const pathToFile = `${upload_path}/${name}`;
  res.sendFile(pathToFile, { root: "./" });
};
