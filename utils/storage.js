const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

const upload_path = "./public/uploads";
// const storage = new Storage();
// const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

function generateRandomFilename(file) {
  try {
    const name =
      crypto.randomBytes(16).toString("hex") + path.extname(file.originalname);
    return name;
  } catch (err) {
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

// exports.bucket = bucket;

exports.upload_path = upload_path;
