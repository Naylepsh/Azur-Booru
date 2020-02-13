const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

function generateRandomFilename(file) {
  try {
    const name = crypto.randomBytes(16).toString('hex') + path.extname(file.originalname);
    return name;
  } catch (err) {
    console.log(err);
    return;
  }
}

exports.storage = multer({ storage: multer.diskStorage({
    destination: (req, res, cb) => {
      cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
      cb(null, generateRandomFilename(file));
    }
  })
})