const request = require("supertest");
const mongoose = require("mongoose");
const { seedComment } = require("../../helpers/database/seed");
const { User } = require("../../../models/user");
const { cleanDatabase } = require("../../helpers/database/clean");
const { generateAuthToken } = require("../../helpers/auth/token");

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
});
