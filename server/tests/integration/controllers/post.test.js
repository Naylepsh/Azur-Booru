const request = require("supertest");
const mongoose = require("mongoose");
const { Post } = require("../../../models/post");
const { Tag } = require("../../../models/tag");

let server;

describe("api/v1/posts", () => {
  let post;

  seedDb = async () => {
    const tagNames = ["tag1", "tag2", "tag3", "tag4", "tag5"].map((name) => {
      return { name };
    });
    const tags = await Tag.insertMany(tagNames);
    const rating = "safe";
    const score = 0;
    const imageLink = "link/to/image";
    const thumbnailLink = "link/to/thumbnail";
    const author = mongoose.Types.ObjectId();
    post = await Post.create({
      tags,
      rating,
      score,
      imageLink,
      thumbnailLink,
      author,
    });
  };

  beforeEach(() => {
    server = require("../../../bin/www");
  });

  afterEach(async () => {
    await server.close();
    await Post.deleteMany({});
    await Tag.deleteMany({});
  });

  describe("GET /", () => {
    it("should list all posts", async () => {
      await seedDb();

      const res = await request(server).get("/api/v1/posts");

      expect(res.status).toBe(200);
      expect(res.body.posts.length).toBe(1);
      expect(res.body.posts[0]._id).toBe(post._id.toString());
    });
  });
});
