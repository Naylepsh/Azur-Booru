const { Post } = require("../../../models/post");
const { EntityCreator } = require("../../helpers/database/entityCreator");

exports.PostCreator = class PostCreator extends EntityCreator {
  constructor(tagIds, authorId) {
    const props = {
      tags: tagIds,
      rating: "safe",
      score: 0,
      imageLink: "link/to/image",
      thumbnailLink: "link/to/thumbnail",
      author: authorId,
    };
    const model = Post;
    super(model, props);
  }
};
