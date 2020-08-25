module.exports = class CommentCreator {
  constructor(authorId, postId) {
    this.author = authorId;
    this.post = postId;
    this.score = 0;
    this.body = "some text";
  }
};
