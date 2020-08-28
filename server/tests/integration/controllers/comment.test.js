const request = require("supertest");
const mongoose = require("mongoose");
const {
  seedComment,
  seedUser,
  seedPost,
} = require("../../helpers/database/seed");
const { cleanDatabase } = require("../../helpers/database/clean");
const { Comment } = require("../../../models/comment");
const { Post } = require("../../../models/post");
const { generateAuthToken } = require("../../helpers/auth/token");

let server;
const API_ENDPOINT = "/api/v1/comments";
const AUTH_TOKEN_HEADER = "x-auth-token";

describe(API_ENDPOINT, () => {
  beforeEach(() => {
    server = require("../../../bin/www");
  });

  afterEach(async () => {
    await server.close();
    await cleanDatabase();
  });

  describe("/ (GET)", () => {
    let comments;
    let query;

    beforeEach(async () => {
      const firstComment = await seedComment();
      const secondComment = await seedComment();
      comments = [firstComment, secondComment];
      query = null;
    });

    it("should return 200", async () => {
      const { status } = await getComments();

      expect(status).toBe(200);
    });

    it("should return all comments", async () => {
      const { body } = await getComments();

      expect(body.comments.length).toBe(comments.length);
    });

    describe("if author query was passed", () => {
      it("should return 200", async () => {
        query = `author=${comments[0].author.name}`;

        const { status } = await getComments();

        expect(status).toBe(200);
      });

      it("should return all comments of passed author", async () => {
        query = `author=${comments[0].author.name}`;

        const { body } = await getComments();

        const commentsOfFirstAuthor = comments.filter(
          (comment) => comment.author.name === comments[0].author.name
        );
        expect(body.comments.length).toBe(commentsOfFirstAuthor.length);
      });

      it("should return 0 comments if passed author does not exist", async () => {
        query = `author=name-that-does-not-exist`;

        const { body } = await getComments();

        expect(body.comments.length).toBe(0);
      });
    });

    describe("if comment body query was passed", () => {
      it("should return 200", async () => {
        query = `body=${comments[0].body}`;

        const { status } = await getComments();

        expect(status).toBe(200);
      });

      it("should return all posts with passed string in their body", async () => {
        query = `body=${comments[0].body}`;

        const { body } = await getComments();

        const commentsWithBodyOfFirstComment = comments.filter(
          (comment) => comment.body === comments[0].body
        );
        expect(body.comments.length).toBe(
          commentsWithBodyOfFirstComment.length
        );
      });
    });

    getComments = () => {
      const url = query ? `${API_ENDPOINT}?${query}` : API_ENDPOINT;
      return request(server).get(url);
    };
  });

  describe("/ (POST)", () => {
    let comment;
    let token;

    beforeEach(async () => {
      const post = await seedPost();
      const user = await seedUser();
      token = user.generateAuthToken();

      comment = {
        postId: post._id,
        body: "sample body",
      };
    });

    it("should return 401 if user was not logged in", async () => {
      token = undefined;

      const { status } = await postComment();

      expect(status).toBe(401);
    });

    it("should return 404 if post with passed id does not exist", async () => {
      comment.postId = mongoose.Types.ObjectId();

      const { status } = await postComment();

      expect(status).toBe(404);
    });

    describe("if valid data was passed", () => {
      it("should return 200", async () => {
        const { status } = await postComment();

        expect(status).toBe(200);
      });

      it("should create comment in database", async () => {
        const { body } = await postComment();

        const comment = await Comment.findById(body._id);
        expect(comment).toHaveProperty("body", comment.body);
      });

      it("should add comment to existing post", async () => {
        const { body } = await postComment();

        const post = await Post.findById(comment.postId).populate("comments");
        const comments = post.comments;
        expect(comments.map((comment) => comment._id.toString())).toContain(
          body._id
        );
      });
    });

    postComment = () => {
      if (token) {
        return request(server)
          .post(API_ENDPOINT)
          .set(AUTH_TOKEN_HEADER, token)
          .send(comment);
      }
      return request(server).post(API_ENDPOINT).send(comment);
    };
  });

  describe("/:id (GET)", () => {
    let comment;
    let id;

    beforeEach(async () => {
      comment = await seedComment();
      id = comment._id;
    });

    it("should return 404 if invalid id was passed", async () => {
      id = 1;

      const { status } = await getComment();

      expect(status).toBe(404);
    });

    it("should return 404 if comment does not exist", async () => {
      id = mongoose.Types.ObjectId();

      const { status } = await getComment();

      expect(status).toBe(404);
    });

    it("should return 200 if valid id was passed", async () => {
      const { status } = await getComment();

      expect(status).toBe(200);
    });

    it("should return comment if valid id was passed", async () => {
      const { body } = await getComment();

      expect(body).toHaveProperty("body", comment.body);
    });

    getComment = () => {
      return request(server).get(`${API_ENDPOINT}/${id}`);
    };
  });

  describe("/:id (DELETE)", () => {
    let comment;
    let id;
    let token;

    beforeEach(async () => {
      comment = await seedComment();
      id = comment._id;
      token = generateAuthToken(comment.author);
    });

    it("should return 401 if user was not logged in", async () => {
      token = undefined;

      const { status } = await deleteComment();

      expect(status).toBe(401);
    });

    it("should return 404 if invalid id was passed", async () => {
      id = 1;

      const { status } = await deleteComment();

      expect(status).toBe(404);
    });

    it("should return 403 if user was not the author of the comment", async () => {
      const user = { id: mongoose.Types.ObjectId() };
      token = generateAuthToken(user);

      const { status } = await deleteComment();

      expect(status).toBe(403);
    });

    it("should return 200 if valid data was passed", async () => {
      const { status } = await deleteComment();

      expect(status).toBe(200);
    });

    it("should delete comment from database if valid data was passed", async () => {
      await deleteComment();

      const comment = await Comment.findById(id);
      expect(comment).toBeNull();
    });

    it("should delete comment from post comment list", async () => {
      await deleteComment();

      const post = await Post.findById(comment.post._id);
      expect(post.comments).not.toContain(id);
    });

    deleteComment = () => {
      const url = `${API_ENDPOINT}/${id}`;
      if (token) {
        return request(server).delete(url).set(AUTH_TOKEN_HEADER, token);
      }
      return request(server).delete(url);
    };
  });

  describe("/:id/vote-up (GET)", () => {
    let comment;
    let id;
    let token;

    beforeEach(async () => {
      comment = await seedComment();
      id = comment._id;
      token = generateAuthToken(comment.author);
    });

    it("should return 401 if user was not logged in", async () => {
      token = undefined;

      const { status } = await voteUp();

      expect(status).toBe(401);
    });

    it("should return 404 if invalid id was passed", async () => {
      id = 1;

      const { status } = await voteUp();

      expect(status).toBe(404);
    });

    it("should return 404 if comment does not exist", async () => {
      id = mongoose.Types.ObjectId();

      const { status } = await voteUp();

      expect(status).toBe(404);
    });

    describe("if valid data was passed", () => {
      it("should return 200", async () => {
        const { status } = await voteUp();

        expect(status).toBe(200);
      });

      it("should increase the score of comment", async () => {
        const commentBeforeVote = await Comment.findById(id);

        await voteUp();

        const commentAfterVote = await Comment.findById(id);
        expect(commentAfterVote.score).toBe(commentBeforeVote.score + 1);
      });

      it("it should cancel user vote if user voted twice", async () => {
        const commentBeforeVote = await Comment.findById(id);

        await voteUp();
        await voteUp();

        const commentAfterVote = await Comment.findById(id);
        expect(commentAfterVote.score).toBe(commentBeforeVote.score);
      });
    });

    voteUp = () => {
      const url = `${API_ENDPOINT}/${id}/vote-up`;
      if (token) {
        return request(server).get(url).set(AUTH_TOKEN_HEADER, token);
      }
      return request(server).get(url);
    };
  });

  describe("/:id/vote-down (GET)", () => {
    let comment;
    let id;
    let token;

    beforeEach(async () => {
      comment = await seedComment();
      id = comment._id;
      token = generateAuthToken(comment.author);
    });

    it("should return 401 if user was not logged in", async () => {
      token = undefined;

      const { status } = await voteDown();

      expect(status).toBe(401);
    });

    it("should return 404 if invalid id was passed", async () => {
      id = 1;

      const { status } = await voteDown();

      expect(status).toBe(404);
    });

    it("should return 404 if comment does not exist", async () => {
      id = mongoose.Types.ObjectId();

      const { status } = await voteDown();

      expect(status).toBe(404);
    });

    describe("if valid data was passed", () => {
      it("should return 200", async () => {
        const { status } = await voteDown();

        expect(status).toBe(200);
      });

      it("should decrease the score of comment", async () => {
        const commentBeforeVote = await Comment.findById(id);

        await voteDown();

        const commentAfterVote = await Comment.findById(id);
        expect(commentAfterVote.score).toBe(commentBeforeVote.score - 1);
      });

      it("it should cancel user vote if user voted twice", async () => {
        const commentBeforeVote = await Comment.findById(id);

        await voteDown();
        await voteDown();

        const commentAfterVote = await Comment.findById(id);
        expect(commentAfterVote.score).toBe(commentBeforeVote.score);
      });
    });

    voteDown = () => {
      const url = `${API_ENDPOINT}/${id}/vote-down`;
      if (token) {
        return request(server).get(url).set(AUTH_TOKEN_HEADER, token);
      }
      return request(server).get(url);
    };
  });
});
