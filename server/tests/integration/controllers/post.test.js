const request = require("supertest");
const mongoose = require("mongoose");
const { PostCreator } = require("../../helpers/database/postCreator");
const { seedPost } = require("../../helpers/database/seed");
const { generateAuthToken } = require("../../helpers/auth/token");
const { cleanDatabase } = require("../../helpers/database/clean");
const { Post } = require("../../../models/post");
const { Tag } = require("../../../models/tag");
const { User } = require("../../../models/user");

let server;
const API_ENDPOINT = "/api/v1/posts";
const AUTH_TOKEN_HEADER = "x-auth-token";

describe(API_ENDPOINT, () => {
  let post;
  let token;
  let id;

  beforeEach(async () => {
    server = require("../../../bin/www");

    post = await seedPost();
    token = generateAuthToken(post.author);
    id = post._id;
  });

  afterEach(async () => {
    await server.close();
    await cleanDatabase();
  });

  describe("GET /", () => {
    it("should list all posts", async () => {
      const res = await request(server).get(API_ENDPOINT);

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
      const res = await sendShowPostRequest();

      expect(res.status).toBe(200);
      expectPostsToBeTheSame(post, res.body.post);
    });

    sendShowPostRequest = () => {
      return request(server).get(`${API_ENDPOINT}/${id}`);
    };
  });

  describe("PUT /:id", () => {
    let updatedPost;

    beforeEach(async () => {
      const postCreator = new PostCreator();
      updatedPost = postCreator.props;
      updatedPost._id = id;
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
      post.tags = new Array(4).map((_, index) => index.toString());

      const res = await sendUpdateRequest();

      expect(res.status).toBe(400);
    });

    it("should return 400 if less than 5 unique tags were passed", async () => {
      post.tags = new Array(4).map((_) => "tag");

      const res = await sendUpdateRequest();

      expect(res.status).toBe(400);
    });

    it("should return 400 if invalid rating was passed", async () => {
      post.rating = "rating";

      const res = await sendUpdateRequest();

      expect(res.status).toBe(400);
    });

    it("should return updated post if post was valid", async () => {
      const res = await sendUpdateRequest();

      expect(res.status).toBe(200);
      expectPostsToBeTheSame(res.body.post, post);
    });

    it("should update post in database if post was valid", async () => {
      await sendUpdateRequest();

      const postInDb = await Post.findById(id);

      expectPostsToBeTheSame(postInDb, post);
    });

    sendUpdateRequest = () => {
      return request(server)
        .put(`${API_ENDPOINT}/${id}`)
        .set(AUTH_TOKEN_HEADER, token)
        .send(post);
    };
  });

  describe("delete /:id", () => {
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

      const postfromdb = await Post.findById(post._id);
      expect(postfromdb).toBe(null);
    });

    it("should remove references from the post's tags to the post", async () => {
      await sendDeleteRequest();

      const tags = await Tag.find({ _id: { $in: post.tags } });
      for (const tag of tags) {
        expect(tag.posts.length).toBe(0);
      }
    });

    sendDeleteRequest = () => {
      return request(server)
        .delete(`${API_ENDPOINT}/${id}`)
        .set(AUTH_TOKEN_HEADER, token);
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
      const postindb = await Post.findById(id);

      expect(postindb.score).toBe(1);
    });

    it("should cancel vote if user already voted up", async () => {
      await sendVoteUpRequest();
      await sendVoteUpRequest();
      const postInDb = await Post.findById(id);

      expect(postInDb.score).toBe(0);
    });

    sendVoteUpRequest = () => {
      return request(server)
        .get(`${API_ENDPOINT}/${id}/vote-up`)
        .set(AUTH_TOKEN_HEADER, token);
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
        .get(`${API_ENDPOINT}/${id}/vote-down`)
        .set(AUTH_TOKEN_HEADER, token);
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
