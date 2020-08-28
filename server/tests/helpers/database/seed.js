const { PostCreator } = require("./postCreator");
const { UserCreator } = require("./userCreator");
const { TagCreator } = require("./tagCreator");
const { RoleCreator } = require("./roleCreator");
const { CommentCreator } = require("./commentCreator");
const { hashPassword } = require("../../../utils/auth");
const { ROLES } = require("../../../models/role");

exports.seedUserRole = async function () {
  const name = ROLES.user;
  const roleCreator = new RoleCreator(name);
  const role = await roleCreator.saveToDatabase();
  return role;
};

exports.seedTag = async function () {
  const tagCreator = new TagCreator();
  const tag = await tagCreator.saveToDatabase();
  return tag;
};

exports.seedUser = async function () {
  const originalPassword = "password";
  const { password } = await hashPassword(originalPassword);
  const roles = [await exports.seedUserRole()];
  const userCreator = new UserCreator(password, roles);
  const user = await userCreator.saveToDatabase();
  user.password = originalPassword;
  return user;
};

exports.seedPost = async function () {
  const author = await exports.seedUser();
  const tags = [];
  for (let i = 0; i < 5; i++) {
    const tag = await exports.seedTag();
    tags.push(tag);
  }
  const postCreator = new PostCreator(tags, author);
  const post = await postCreator.saveToDatabase();
  return post;
};

exports.seedComment = async function () {
  const author = await exports.seedUser();
  const post = await exports.seedPost();
  const commentCreator = new CommentCreator(author, post);
  const comment = await commentCreator.saveToDatabase();
  return comment;
};
