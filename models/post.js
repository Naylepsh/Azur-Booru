const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  imageLink: String, 
  source: String,
  title: String,
  tags: [String]
});

module.exports = mongoose.model('Post', PostSchema);