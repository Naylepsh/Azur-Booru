const multer = require('multer'),
  nameGen = require('./name-gen');

module.exports = {
  initStorage(){
    return multer({ storage: multer.diskStorage({
      destination: (req, res, cb) => {
        cb(null, './uploads/');
      },
      filename: (req, file, cb) => {
        cb(null, nameGen.generateRandomFilename(file));
      }
    })});
  },

  binImgToStrImg(image){
    const base64Flag = 'data:' + image.contentType + ';base64,';
    const imageString = image.data.toString('base64');
    return base64Flag + imageString;
  }
}