const request = require("supertest");
const mongoose = require("mongoose");
const {
  seedComment,
  seedUser,
  seedPost,
} = require("../../helpers/database/seed");
const { User } = require("../../../models/user");
const { cleanDatabase } = require("../../helpers/database/clean");
const { Comment } = require("../../../models/comment");
const { Post } = require("../../../models/post");

let server;
const apiEndpoint = "/api/v1/comments";

describe(apiEndpoint, () => {
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
      const url = query ? `${apiEndpoint}?${query}` : apiEndpoint;
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
          .post(apiEndpoint)
          .set("x-auth-token", token)
          .send(comment);
      }
      return request(server).post(apiEndpoint).send(comment);
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
      return request(server).get(`${apiEndpoint}/${id}`);
    };
  });
});
