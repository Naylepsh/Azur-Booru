const multer = require('multer'),
  nameGen = require('./name-gen');

module.exports = multer({ storage: multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, nameGen.generateRandomFilename(file));
  }
})})