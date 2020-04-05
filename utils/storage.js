const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

const upload_path = "./public/uploads";

function generateRandomFilename(file) {
  try {
    const name =
      crypto.randomBytes(16).toString("hex") + path.extname(file.originalname);
    return name;
  } catch (err) {
    // TODO: Add better error handling
    console.log(err);
    return;
  }
}

exports.storage = multer({
  storage: multer.diskStorage({
    destination: (req, res, cb) => {
      cb(null, upload_path);
    },
    filename: (req, file, cb) => {
      cb(null, generateRandomFilename(file));
    },
  }),
});

exports.upload_path = upload_path;
