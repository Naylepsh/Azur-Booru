const crypto = require('crypto'),
  path = require('path');

module.exports = {
  generateRandomFilename(file){
    try {
      const name = crypto.randomBytes(16).toString('hex') + path.extname(file.originalname);
      return name;
    } catch (err) {
      console.log(err);
      return;
    }
  }
}