const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  imageLink: String,
  thumbnailLink: String,
  source: String,
  title: String,
  tags: [String],
  rating: String
});

module.exports = mongoose.model('Post', PostSchema);