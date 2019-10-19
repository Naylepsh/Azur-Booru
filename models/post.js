const mongoose = require('mongoose'),

const PostSchema = new mongoose.Schema({
  file: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image'
  },
  source: String,
  title: String,
  tags: [String]
});

module.exports = mongoose.model('Post', PostSchema);