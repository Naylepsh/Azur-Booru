const request = require("supertest");
const mongoose = require("mongoose");
const { Post } = require("../../../models/post");
const { Tag } = require("../../../models/tag");
const { User } = require("../../../models/user");
const { Role, ROLES } = require("../../../models/role");

let server;
const apiEndpoint = "/api/v1/posts";

describe(apiEndpoint, () => {
  let post;
  let id;
  let tags;
  let tagNames = ["tag1", "tag2", "tag3", "tag4", "tag5"].map((name) => {
    return { name };
  });
  const rating = "safe";
  const score = 0;
  const imageLink = "link/to/image";
  const thumbnailLink = "link/to/thumbnail";
  let author;

  let token;

  beforeEach(async () => {
    server = require("../../../bin/www");

    const user = new Role({ name: ROLES.user });
    author = await User.create({
      name: "user",
      password: "password",
      roles: [user],
    });
    token = author.generateAuthToken();

    await seedDb();
    id = post._id;
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

  afterEach(async () => {
    await server.close();
    await Post.remove({});
    await Tag.remove({});
    await User.remove({});
    await Role.remove({});
  });

  describe("GET /", () => {
    it("should list all posts", async () => {
      const res = await request(server).get(apiEndpoint);

      expect(res.status).toBe(200);
      expect(res.body.posts.length).toBe(1);
      expectPostsToBeTheSame(post, res.body.posts[0]);
    });
  });

  describe("GET /:id", () => {
    it("should return 404 if invalid id was passed", async () => {
      await expectRequestToInvalidIdToReturn404(sendShowPostRequest);
    });

    it("should return 404 if post doesn't exist", async () => {
      await expectRequestToNonExistingPostToReturn404(sendShowPostRequest);
    });

    it("should return a post if valid id was passed", async () => {
      const res = await request(server).get(
        `${apiEndpoint}/${post._id.toString()}`
      );

      expect(res.status).toBe(200);
      expectPostsToBeTheSame(post, res.body.post);
    });

    sendShowPostRequest = () => {
      return request(server).get(`${apiEndpoint}/${id}`);
    };
  });

  describe("PUT /:id", () => {
    let updatedPost;

    beforeEach(async () => {
      updatedPost = createPostModel();
      updatedPost._id = post._id;
    });

    it("should return 401 if user is not logged in", async () => {
      await expectUnauthorizedRequestToReturn401(sendUpdateRequest);
    });

    it("should return 404 if invalid id is passed", async () => {
      await expectRequestToInvalidIdToReturn404(sendUpdateRequest);
    });

    it("should return 404 if post doesn't exist", async () => {
      await expectRequestToNonExistingPostToReturn404(sendUpdateRequest);
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

    sendUpdateRequest = () => {
      return request(server)
        .put(`${apiEndpoint}/${id}`)
        .set("x-auth-token", token)
        .send(updatedPost);
    };
  });

  describe("DELETE /:id", () => {
    it("should return 401 if user is not logged in", async () => {
      await expectUnauthorizedRequestToReturn401(sendDeleteRequest);
    });

    it("should return 404 if invalid id was passed", async () => {
      await expectRequestToInvalidIdToReturn404(sendDeleteRequest);
    });

    it("should return 404 if post doesn't exist", async () => {
      await expectRequestToNonExistingPostToReturn404(sendDeleteRequest);
    });

    it("should return 403 if user is not the post's author", async () => {
      token = new User().generateAuthToken();

      const res = await sendDeleteRequest();

      expect(res.status).toBe(403);
    });

    it("should remove post from database if id was valid and user was it's author", async () => {
      await sendDeleteRequest();

      const postFromDb = await Post.findById(post._id);
      expect(postFromDb).toBe(null);
    });

    sendDeleteRequest = () => {
      return request(server)
        .delete(`${apiEndpoint}/${id}`)
        .set("x-auth-token", token);
    };
  });

  describe("vote up", () => {
    it("should return 401 if user isn't logged in", async () => {
      await expectUnauthorizedRequestToReturn401(sendVoteDownRequest);
    });

    it("should return 404 if invalid id was passed", async () => {
      await expectRequestToInvalidIdToReturn404(sendVoteUpRequest);
    });

    it("should return 404 if post doesn't exists", async () => {
      await expectRequestToNonExistingPostToReturn404(sendVoteUpRequest);
    });

    it("should upvote if user hasn't voted up", async () => {
      await sendVoteUpRequest();
      const postInDb = await Post.findById(id);

      expect(postInDb.score).toBe(1);
    });

    it("should cancel vote if user already voted up", async () => {
      await sendVoteUpRequest();
      await sendVoteUpRequest();
      const postInDb = await Post.findById(id);

      expect(postInDb.score).toBe(0);
    });

    sendVoteUpRequest = () => {
      return request(server)
        .get(`${apiEndpoint}/${id}/vote-up`)
        .set("x-auth-token", token);
    };
  });

  describe("vote down", () => {
    it("should return 401 if user isn't logged in", async () => {
      await expectUnauthorizedRequestToReturn401(sendVoteDownRequest);
    });

    it("should return 404 if invalid id was passed", async () => {
      await expectRequestToInvalidIdToReturn404(sendVoteDownRequest);
    });

    it("should return 404 if post doesn't exists", async () => {
      await expectRequestToNonExistingPostToReturn404(sendVoteDownRequest);
    });

    it("should upvote if user hasn't voted up", async () => {
      await sendVoteDownRequest();
      const postInDb = await Post.findById(id);

      expect(postInDb.score).toBe(-1);
    });

    it("should cancel vote if user already voted up", async () => {
      await sendVoteDownRequest();
      await sendVoteDownRequest();
      const postInDb = await Post.findById(id);

      expect(postInDb.score).toBe(0);
    });

    sendVoteDownRequest = () => {
      return request(server)
        .get(`${apiEndpoint}/${id}/vote-down`)
        .set("x-auth-token", token);
    };
  });

  expectRequestToNonExistingPostToReturn404 = async (sendRequest) => {
    id = mongoose.Types.ObjectId();

    const res = await sendRequest();

    expect(res.status).toBe(404);
  };

  expectRequestToInvalidIdToReturn404 = async (sendRequest) => {
    id = 1;

    const res = await sendRequest();

    expect(res.status).toBe(404);
  };

  expectUnauthorizedRequestToReturn401 = async (sendRequest) => {
    token = "";

    const res = await sendRequest();

    expect(res.status).toBe(401);
  };

  expectPostsToBeTheSame = (expected, actual) => {
    expect(actual._id.toString()).toBe(expected._id.toString());
    expect(actual.rating).toBe(expected.rating);
    expect(actual.score).toBe(expected.score);
    expect(actual.imageLink).toBe(expected.imageLink);
    expect(actual.thumbnailLink).toBe(expected.thumbnailLink);
    expect(actual.tags.length).toBe(expected.tags.length);
  };
});
