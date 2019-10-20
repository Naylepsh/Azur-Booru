const multer = require('multer'),
  nameGen = require('./name-gen');

// Create storage
const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, nameGen.generateRandomFilename(file));
  }
});

module.exports = multer({ storage: storage });