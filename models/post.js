const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image'
  },
  source: String,
  title: String,
  tags: [String]
});

module.exports = mongoose.model('Post', PostSchema);