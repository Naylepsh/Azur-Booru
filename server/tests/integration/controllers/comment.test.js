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

    beforeEach(async () => {
      const comment = await seedComment();
      comments = [comment];
    });

    it("should return 200", async () => {
      const { status } = await getComments();

      expect(status).toBe(200);
    });

    getComments = () => {
      return request(server).get(apiEndpoint);
    };
  });
});
