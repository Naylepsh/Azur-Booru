const gcsHelpers = require("../../utils/google-cloud-storage");
const { copyFileToGCS } = gcsHelpers;
const { upload_path } = require("../../utils/storage");
const { bucket } = require("../../config");

exports.saveImage = async function (imageName) {
  const localFilePath = `${upload_path}/${imageName}`;
  const url = await copyFileToGCS(localFilePath, bucket.name);
  return url;
};

exports.getImage = function (name) {
  const url = bucket.name + name;
  return url;
};
