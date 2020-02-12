const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
    maxlength: 64
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024
  }
});

function validateUser(user) {
  // const schema = {
  //   name: Joi.string().min(4).max(64).required(),
  //   password: Joi.string().min(4).max(255).required()
  // }
  const schema = Joi.object({
    name: Joi.string().min(4).max(64).required(),
    password: Joi.string().min(8).max(255).required()
  });
  return schema.validate(user);
}

exports.User = mongoose.model('User', UserSchema);
exports.validate = validateUser;