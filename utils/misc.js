const jimp = require('jimp');
const fs = require('fs');

module.exports = {
  makeThumbnail: async (pathToFile, pathToThumbnail) => {
    const image = await jimp.read(pathToFile);
    let thumbnail = image.clone();
    const xSize = 200;
    const ySize = 200;
    thumbnail.cover(xSize, ySize);
    await thumbnail.writeAsync(pathToThumbnail);
  },

  removeFile: (pathToFile) => {
    fs.unlink(pathToFile, err => {
      if (err) {
        console.error(err);
      }
    });
  },

  paginationInfo: (numberOfRecords, page, images_per_page) => {
    return {
      currentPage: page ? parseInt(page) : 1,
      lastPage: Math.ceil(numberOfRecords / images_per_page)
    }
  },

  distinctWordsInString: (str) => {
    if (!str) return [];
    const words = str.replace(/\s/g, ' ').split(' ').filter( word => word.length > 0);
    return [...new Set(words)];
  },

  sendError: (res, err, backupCode) => {
    res.status(err.status || backupCode).json({
      message: err.message,
      error: err
    });
  },

  /**
   * lodash's .pick implementation.
   * Leaves only selected attributes of a given object
   */
  pickAttributes: (object, keys) => {
    console.log(object);
    return keys.reduce((obj, key) => {
      if (object && object.hasOwnProperty(key)) {
         obj[key] = object[key];
      }
      return obj;
    }, {});
  }
}