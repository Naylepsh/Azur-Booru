const { upload_path } = require("../utils/storage");
const { makeThumbnail } = require("../utils/misc");

exports.saveThumbnail = async function (req, res, next) {
  const pathToFile = `${upload_path}/${req.file.filename}`;
  const thumbnailName = `thumbnail_${req.file.filename}`;
  const pathToThumbnail = `${upload_path}/${thumbnailName}`;
  await makeThumbnail(pathToFile, pathToThumbnail);
  req.thumbnail = { filename: thumbnailName };
  next();
};
