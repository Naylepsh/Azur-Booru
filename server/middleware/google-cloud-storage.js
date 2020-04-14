const gcsHelpers = require("../utils/google-cloud-storage");
const { copyFileToGCS } = gcsHelpers;
const { upload_path } = require("../utils/storage");
const { bucket } = require("../config");
const { makeThumbnail } = require("../utils/misc");

exports.uploadImageToGCS = async (req, res, next) => {
  req.filename = req.file.filename;
  const localFilePath = `${upload_path}/${req.file.filename}`;
  const URL = await copyFileToGCS(localFilePath, bucket.name);
  req.postImageURL = URL;
  next();
};

exports.prepareThumbnail = async (req, res, next) => {
  const pathToFile = `${upload_path}/${req.file.filename}`;
  const thumbnailName = `thumbnail_${req.file.filename}`;
  const pathToThumbnail = `${upload_path}/${thumbnailName}`;
  await makeThumbnail(pathToFile, pathToThumbnail);
  req.file = { filename: thumbnailName };
  next();
};

exports.uploadThumbnailToGCS = async (req, res, next) => {
  const localFilePath = `${upload_path}/${req.file.filename}`;
  const URL = await copyFileToGCS(localFilePath, bucket.name);
  req.postThumbnailURL = URL;
  next();
};
