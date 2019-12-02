const multer = require('multer');
const nameGen = require('./name-gen');

module.exports = multer({ storage: multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, './public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, nameGen.generateRandomFilename(file));
  }
})})