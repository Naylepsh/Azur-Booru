const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  voters: {
    up: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    down: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  score: {
    type: Number,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
  },
});

CommentSchema.statics.paginate = function (query, toSkip, toLimit) {
  return this.find(query)
    .sort({ _id: -1 })
    .skip(toSkip)
    .limit(toLimit)
    .populate("author")
    .populate("post");
};

exports.Comment = mongoose.model("Comment", CommentSchema);
