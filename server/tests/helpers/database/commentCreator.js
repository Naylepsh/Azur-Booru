const { EntityCreator } = require("./entityCreator");
const { Comment } = require("../../../models/comment");

exports.CommentCreator = class CommentCreator extends EntityCreator {
  constructor(author, post) {
    const model = Comment;
    const props = {
      author: author,
      post: post,
      score: 0,
      body: "some text",
    };
    super(model, props);
  }
};
