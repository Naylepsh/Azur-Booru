const request = require("supertest");
const mongoose = require("mongoose");
const { Post } = require("../../../models/post");
const { Tag } = require("../../../models/tag");
const { User } = require("../../../models/user");
const { Role, ROLES } = require("../../../models/role");

let server;
const apiEndpoint = "/api/v1/comments";

describe(apiEndpoint, () => {
  describe("comments GET", () => {
    it("should list all comments", async () => {
      expect(1).toBe(1);
    });
  });
});
