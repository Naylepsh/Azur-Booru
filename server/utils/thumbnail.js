const jimp = require("jimp");
const fs = require("fs");

exports.createThumbnail = async function (pathToFile, pathToThumbnail) {
  const image = await jimp.read(pathToFile);
  let thumbnail = image.clone();
  const xSize = 200;
  const ySize = 200;
  thumbnail.cover(xSize, ySize);
  await thumbnail.writeAsync(pathToThumbnail);
};
