const { Storage } = require("@google-cloud/storage");
const path = require("path");
const { upload_path } = require("../../utils/storage");
const { bucket } = require("../../config");

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_CLOUD_KEYFILE,
});

exports.saveImage = async function (imageName) {
  const localFilePath = `${upload_path}/${imageName}`;
  const url = await copyFileToGCS(localFilePath, bucket.name);
  return url;
};

exports.getImage = function (name) {
  const url = bucket.name + name;
  return url;
};

async function copyFileToGCS(localFilePath, bucketName, options) {
  options = options || {};

  const bucket = storage.bucket(bucketName);
  const gcsName = path.basename(localFilePath);
  const file = bucket.file(gcsName);

  await bucket.upload(localFilePath, options);
  await file.makePublic();
  return getPublicUrl(bucketName, gcsName);
}

function getPublicUrl(bucketName, fileName) {
  `https://storage.googleapis.com/${bucketName}/${fileName}`;
}
