const { PostCreator } = require("./postCreator");
const { UserCreator } = require("./userCreator");
const { TagCreator } = require("./tagCreator");

exports.seedTag = async function () {
  const tagCreator = new TagCreator();
  const tag = await tagCreator.saveToDatabase();
  return tag;
};

exports.seedUser = async function () {
  const userCreator = new UserCreator();
  const user = await userCreator.saveToDatabase();
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
