const LocalStorageService = require("../services/storage/local-storage.service");

exports.get = function (req, res) {
  const name = req.params.name;
  const image = LocalStorageService.getImage(name);
  res.sendFile(image, { root: "./" });
};
