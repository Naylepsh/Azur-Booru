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
      message: err.message
    });
  },

  /**
   * lodash's .pick implementation.
   * Leaves only selected attributes of a given object
   */
  pickAttributes: (object, keys) => {
    return keys.reduce((obj, key) => {
      // prototype.has.... in case if object is of a null prototype
      if (object && Object.prototype.hasOwnProperty.call(object, key)) {
         obj[key] = object[key];
      }
      return obj;
    }, {});
  },

  swapKeysAndValues: (object) => {
    let swapped = {};
    for(const key in object){
      swapped[object[key]] = key;
    }
    return swapped;
  },

  toggleInArray: (object, array) => {
    const index = array.indexOf(object);
    if (index > -1) {
      array.splice(index, 1);
    } else {
      array.push(object);
    }
    return array;
  },

  removeFromArrayIfExists: (object, array) => {
    const index = array.indexOf(object);
    if (index > -1) {
      array.splice(index, 1);
    }
    return array;
  }
}