module.exports = {
  distinctWordsInString: (str) => {
    if (!str) return [];
    const words = str
      .replace(/\s/g, " ")
      .split(" ")
      .filter((word) => word.length > 0);
    return [...new Set(words)];
  },

  distinctWordsInArray: (words) => {
    return [...new Set(words)];
  },

  sendError: (res, err, backupCode) => {
    res.status(err.status || backupCode).json({
      message: err.message,
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
    const values = Object.values(object);
    const uniqueValues = new Set(values);
    if (uniqueValues.size !== values.length) {
      throw new Error("Object values are not unique");
    }

    let swapped = {};
    for (const key in object) {
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
  },
};
