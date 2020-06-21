const { UserCreator } = require("./userCreator");
const { Post } = require("../../../models/post");
const { Tag } = require("../../../models/tag");

class PostCreator {
  constructor() {
    this.id;
    this.tags;
    this.tagNames = ["tag1", "tag2", "tag3", "tag4", "tag5"];
    this.rating = "safe";
    this.score = 0;
    this.imageLink = "link/to/image";
    this.thumbnailLink = "link/to/thumbnail";
    this.author;
  }

  createPostModel() {
    return {
      tags: this.tags,
      rating: this.rating,
      score: this.score,
      imageLink: this.imageLink,
      thumbnailLink: this.thumbnailLink,
      author: this.author,
    };
  }

  async saveToDatabase() {
    const tagObjects = this.tagNames.map((name) => {
      return { name };
    });
    this.tags = await Tag.insertMany(tagObjects);
    const model = this.createPostModel();
    return Post.create(model);
  }
}

module.exports = PostCreator;
