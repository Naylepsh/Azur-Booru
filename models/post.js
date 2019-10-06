const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  file: String,
  source: String,
  title: String,
  tags: [String]
});

module.exports = mongoose.model('Post', postSchema);