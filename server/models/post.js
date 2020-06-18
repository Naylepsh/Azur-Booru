const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const MIN_TAGS = 5;
const VALID_RATINGS = ["safe", "questionable", "explicit"];

const PostSchema = new mongoose.Schema({
  imageLink: String,
  thumbnailLink: String,
  source: String,
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: String,
    required: true,
    validate: {
      validator: isValidRating,
      message: "{VALUE} is not a valid rating",
    },
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  score: {
    type: Number,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
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
});

PostSchema.statics.paginate = function (query, toSkip, toLimit) {
  return this.find(query).sort({ _id: -1 }).skip(toSkip).limit(toLimit);
};

function validatePost(post) {
  const schema = Joi.object({
    source: Joi.any(),
    tags: Joi.array().min(MIN_TAGS).required(),
    rating: Joi.string()
      .required()
      .custom(isValidRating, "is not valid rating"),
    score: Joi.number().required(),
    imageLink: Joi.string().required(),
    thumbnailLink: Joi.string().required(),
    author: Joi.required(),
  });
  return schema.validate(post);
}

function isValidRating(rating, helpers) {
  if (!VALID_RATINGS.includes(rating)) {
    return helpers.error("any.invalid");
  }

  return rating;
}

exports.Post = mongoose.model("Post", PostSchema);
exports.validate = validatePost;
