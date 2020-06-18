const request = require("supertest");
const mongoose = require("mongoose");
const { Post } = require("../../../models/post");
const { Tag } = require("../../../models/tag");
const { User } = require("../../../models/user");

let server;
const apiEndpoint = "/api/v1/posts";

describe(apiEndpoint, () => {
  let post;
  let tags;
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
    tags = await Tag.insertMany(tagNames);
    post = await Post.create(createPostModel());
  };

  createPostModel = () => {
    return { tags, rating, score, imageLink, thumbnailLink, author };
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

  describe("PUT /:id", () => {
    let token;
    let id;

    beforeEach(async () => {
      token = new User().generateAuthToken();
      id = post._id;
    });

    it("should return 401 if user is not logged in", async () => {
      token = "";

      const res = await sendUpdateRequest();

      expect(res.status).toBe(401);
    });

    it("should return 404 if invalid id is passed", async () => {
      id = 1;

      const res = await sendUpdateRequest();

      expect(res.status).toBe(404);
    });

    sendUpdateRequest = async () => {
      const updatedPost = createPostModel();
      return await request(server)
        .put(`${apiEndpoint}/${id}`)
        .set("x-auth-token", token)
        .send(updatedPost);
    };

    it("should return 404 if post was not found", async () => {
      id = mongoose.Types.ObjectId();

      const res = await sendUpdateRequest();

      expect(res.status).toBe(404);
    });

    // it('should return 400 if less than 5 tags were passed')
    // it('should return 400 if rating was not passed')
    // it('should return updated post if post was valid')
    // it('should update post in database if post was valid')
  });
});
