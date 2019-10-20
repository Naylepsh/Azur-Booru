const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String
}, {
  timestamps: true
});

module.exports = new mongoose.model('Image', ImageSchema);