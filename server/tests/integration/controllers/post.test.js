const request = require("supertest");
const mongoose = require("mongoose");
const { Post } = require("../../../models/post");
const { Tag } = require("../../../models/tag");

let server;
const apiEndpoint = "/api/v1/posts";

describe(apiEndpoint, () => {
  let post;
  const tagNames = ["tag1", "tag2", "tag3", "tag4", "tag5"].map((name) => {
    return { name };
  });
  const rating = "safe";
  const score = 0;
  const imageLink = "link/to/image";
  const thumbnailLink = "link/to/thumbnail";
  const author = mongoose.Types.ObjectId();

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

      const res = await request(server).get(apiEndpoint);

      expect(res.status).toBe(200);
      expect(res.body.posts.length).toBe(1);
      expectPostsToBeTheSame(post, res.body.posts[0]);
    });
  });

  seedDb = async () => {
    const tags = await Tag.insertMany(tagNames);
    post = await Post.create({
      tags,
      rating,
      score,
      imageLink,
      thumbnailLink,
      author,
    });
  };

  expectPostsToBeTheSame = (expected, actual) => {
    expect(actual._id.toString()).toBe(expected._id.toString());
    expect(actual.rating).toBe(expected.rating);
    expect(actual.score).toBe(expected.score);
    expect(actual.imageLink).toBe(expected.imageLink);
    expect(actual.thumbnailLink).toBe(expected.thumbnailLink);
    expect(actual.tags.length).toBe(expected.tags.length);
  };

  describe("GET /:id", () => {
    it("should return a post if valid id was passed", async () => {
      await seedDb();

      const res = await request(server).get(
        `${apiEndpoint}/${post._id.toString()}`
      );

      expect(res.status).toBe(200);
      expectPostsToBeTheSame(post, res.body.post);
    });

    it("should return 404 if invalid id was passed", async () => {
      const id = 1;

      const res = await request(server).get(`${apiEndpoint}/${id}`);

      expect(res.status).toBe(404);
    });

    it("should return 404 if post was not found", async () => {
      const id = mongoose.Types.ObjectId();

      const res = await request(server).get(`${apiEndpoint}/${id}`);

      expect(res.status).toBe(404);
    });
  });
});
