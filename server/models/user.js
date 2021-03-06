const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const Role = require("./role");

const NAME_MIN_LENGTH = 4;
const NAME_MAX_LENGTH = 64;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 256;
const PASSWORD_HASHED_MAX_LENGTH = 1024;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: NAME_MIN_LENGTH,
    maxlength: NAME_MAX_LENGTH,
  },
  password: {
    type: String,
    required: true,
    minlength: PASSWORD_MIN_LENGTH,
    maxlength: PASSWORD_HASHED_MAX_LENGTH,
  },
  roles: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Role",
    required: true,
    validate: {
      validator: function (v) {
        return v && v.length > 0;
      },
      message: "At least one role required.",
    },
  },
});

UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
  return token;
};

UserSchema.methods.getRoles = async function () {
  const roleNames = await Role.getRoleNames(this.roles);
  return roleNames;
};

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(NAME_MIN_LENGTH).max(NAME_MAX_LENGTH).required(),
    password: Joi.string()
      .min(PASSWORD_MIN_LENGTH)
      .max(PASSWORD_MAX_LENGTH)
      .required(),
  });
  return schema.validate(user);
}

const User = mongoose.model("User", UserSchema);

exports.User = User;
exports.validate = validateUser;
