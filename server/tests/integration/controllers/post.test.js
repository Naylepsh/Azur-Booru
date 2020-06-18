const request = require("supertest");
const mongoose = require("mongoose");
const { Post } = require("../../../models/post");
const { Tag } = require("../../../models/tag");
const { User } = require("../../../models/user");
const { update } = require("../../../controllers/postController");

let server;
const apiEndpoint = "/api/v1/posts";

describe(apiEndpoint, () => {
  let post;
  let tags;
  let tagNames = ["tag1", "tag2", "tag3", "tag4", "tag5"].map((name) => {
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
    await Post.remove({});
    await Tag.remove({});
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
    post = createPostModel();
    postInDb = await Post.create(createPostModel());
    post._id = postInDb._id;
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
    let updatedPost;

    beforeEach(async () => {
      await seedDb();
      token = new User().generateAuthToken();
      updatedPost = createPostModel();
      updatedPost._id = post._id;

      const posts = await Post.find({});
      expect(posts.length).toBe(1);
    });

    it("should return 401 if user is not logged in", async () => {
      token = "";

      const res = await sendUpdateRequest();

      expect(res.status).toBe(401);
    });

    it("should return 404 if invalid id is passed", async () => {
      updatedPost._id = 1;

      const res = await sendUpdateRequest();

      expect(res.status).toBe(404);
    });

    sendUpdateRequest = async () => {
      const id = updatedPost._id;

      return await request(server)
        .put(`${apiEndpoint}/${id}`)
        .set("x-auth-token", token)
        .send(updatedPost);
    };

    it("should return 404 if post was not found", async () => {
      updatedPost._id = mongoose.Types.ObjectId();

      const res = await sendUpdateRequest();

      expect(res.status).toBe(404);
    });

    it("should return 400 if less than 5 tags were passed", async () => {
      updatedPost.tags = new Array(4).map((_, index) => index.toString());

      const res = await sendUpdateRequest();

      expect(res.status).toBe(400);
    });

    it("should return 400 if less than 5 unique tags were passed", async () => {
      updatedPost.tags = new Array(4).map((_) => "tag");

      const res = await sendUpdateRequest();

      expect(res.status).toBe(400);
    });

    it("should return 400 if invalid rating was passed", async () => {
      updatedPost.rating = "rating";

      const res = await sendUpdateRequest();

      expect(res.status).toBe(400);
    });

    it("should return updated post if post was valid", async () => {
      const res = await sendUpdateRequest();

      expect(res.status).toBe(200);
      expectPostsToBeTheSame(res.body, updatedPost);
    });

    it("should update post in database if post was valid", async () => {
      await sendUpdateRequest();

      const postInDb = await Post.findById(updatedPost._id);

      expectPostsToBeTheSame(postInDb, updatedPost);
    });
  });
});
