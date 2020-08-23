const StorageService = require("../services/storage");

exports.storeImage = async function (req, res, next) {
  const original = req.file.filename;
  req.imageUrl = await StorageService.saveImage(original);

  const thumbnail = req.thumbnail.filename;
  req.thumbnailUrl = await StorageService.saveImage(thumbnail);

  next();
};
