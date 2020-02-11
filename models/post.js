const mongoose = require('mongoose');

const MIN_TAGS = 3

const PostSchema = new mongoose.Schema({
  imageLink: String,
  thumbnailLink: String,
  source: String,
  title: String,
  tags: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Tag',
    validate: {
      validator: function(value) {
        return value && value.length >= MIN_TAGS;
      },
      message: `Post should contain at least ${MIN_TAGS} tags`
    }
  },
  rating: {
    type: String,
    required: true
  }
});

PostSchema.statics.paginate = function(query, toSkip, toLimit) {
  return this.find(query).sort({ _id: -1 }).skip(toSkip).limit(toLimit);
}

module.exports = mongoose.model('Post', PostSchema);