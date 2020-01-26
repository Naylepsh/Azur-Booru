const jimp = require('jimp');


module.exports = {
  makeThumbnail: async (pathToFile, pathToThumbnail) => {
    const image = await jimp.read(pathToFile);
    let thumbnail = image.clone();
    const xSize = 200;
    const ySize = 200;
    thumbnail.cover(xSize, ySize);
    await thumbnail.writeAsync(pathToThumbnail);
  },

  pageInfo: (numberOfRecords, page, images_per_page) => {
    return {
      currentPage: page ? parseInt(page) : 1,
      lastPage: Math.ceil(numberOfRecords / images_per_page)
    }
  },

  sendError: (res, err, backupCode) => {
    res.status(err.status || backupCode).json({
      message: err.message,
      error: err
    });
  }
}