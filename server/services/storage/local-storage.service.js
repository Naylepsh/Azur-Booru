const { upload_path } = require("../../utils/storage");

// since multer.storage.single is required before using saveImage, this one does nothing
exports.saveImage = function (imageName) {
  const prefix = "http://localhost:3001/api/v1/images/";
  return prefix + imageName;
};

exports.getImage = function (name) {
  return `${upload_path}/${name}`;
};
