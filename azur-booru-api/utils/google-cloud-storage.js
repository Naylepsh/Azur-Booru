const { Storage } = require("@google-cloud/storage");
const path = require("path");

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_CLOUD_KEYFILE,
});

exports.getPublicUrl = (bucketName, fileName) =>
  `https://storage.googleapis.com/${bucketName}/${fileName}`;

exports.copyFileToGCS = async (localFilePath, bucketName, options) => {
  options = options || {};

  const bucket = storage.bucket(bucketName);
  const gcsName = path.basename(localFilePath);
  const file = bucket.file(gcsName);

  await bucket.upload(localFilePath, options);
  await file.makePublic();
  return exports.getPublicUrl(bucketName, gcsName);
};
