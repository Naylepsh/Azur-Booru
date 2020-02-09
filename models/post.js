const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  imageLink: String,
  thumbnailLink: String,
  source: String,
  title: String,
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  rating: String
});

PostSchema.statics.paginate = function(query, toSkip, toLimit) {
  return this.find(query).sort({ _id: -1 }).skip(toSkip).limit(toLimit);
}

module.exports = mongoose.model('Post', PostSchema);