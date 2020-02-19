const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  voters: {
    up: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    down: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  score: {
    type: Number,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value'
    }
  }
});

exports.Comment = mongoose.model('Comment', CommentSchema);