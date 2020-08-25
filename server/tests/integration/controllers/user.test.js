const request = require("supertest");
const mongoose = require("mongoose");
const { seedUser } = require("../../helpers/database/seed");
const { User } = require("../../../models/user");
const { cleanDatabase } = require("../../helpers/database/clean");

jest.setTimeout(10000);

let server;
const apiEndpoint = "/api/v1/users";

describe(apiEndpoint, () => {
  let user;

  beforeEach(async () => {
    server = require("../../../bin/www");
  });

  afterEach(async () => {
    await server.close();
    await cleanDatabase();
  });

  describe("register", () => {
    beforeEach(() => {
      user = {
        name: "name",
        password: "password",
      };
    });

    it("should return 400 if name was not passed", async () => {
      delete user.name;

      const res = await registerUser();

      expect(res.status).toBe(400);
    });

    it("should return 400 if name is shorter than 4 characters", async () => {
      user.name = createStringOfNCharacters(3);

      const res = await registerUser();

      expect(res.status).toBe(400);
    });

    it("should return 400 if name is longer than 64 characters", async () => {
      user.name = createStringOfNCharacters(65);

      const res = await registerUser();

      expect(res.status).toBe(400);
    });

    it("should return 400 if password was not passed", async () => {
      delete user.password;

      const res = await registerUser();

      expect(res.status).toBe(400);
    });

    it("should return 400 if password is shorter than 8 characters", async () => {
      user.password = createStringOfNCharacters(7);

      const res = await registerUser();

      expect(res.status).toBe(400);
    });

    it("should return 400 if password is longer than 256 characters", async () => {
      user.password = createStringOfNCharacters(257);

      const res = await registerUser();

      expect(res.status).toBe(400);
    });

    it("should return 400 if user already exists", async () => {
      await registerUser();

      const res = await registerUser();

      expect(res.status).toBe(400);
    });

    it("should return 200 if valid data was passed", async () => {
      const res = await registerUser();

      expect(res.status).toBe(200);
    });

    it("should create user in database if valid data was passed", async () => {
      const usersBeforeRegistration = await User.find({});

      await registerUser();
      const usersAfterRegistration = await User.find({});

      expect(
        usersAfterRegistration.length - usersBeforeRegistration.length
      ).toBe(1);
    });

    registerUser = () => {
      return request(server).post(`${apiEndpoint}/register`).send(user);
    };

    createStringOfNCharacters = (n) => {
      return [...Array(n).keys(0)].map((_) => "a").join("");
    };
  });

  describe("/login", () => {
    beforeEach(async () => {
      const { name, password } = await seedUser();
      user = { name, password };
    });

    it("should return 400 if name was not passed", async () => {
      delete user.name;

      const res = await login();

      expect(res.status).toBe(400);
    });

    it("should return 400 if name is shorter than 4 characters", async () => {
      user.name = createStringOfNCharacters(3);

      const res = await login();

      expect(res.status).toBe(400);
    });

    it("should return 400 if name is longer than 64 characters", async () => {
      user.name = createStringOfNCharacters(65);

      const res = await login();

      expect(res.status).toBe(400);
    });

    it("should return 400 if password was not passed", async () => {
      delete user.password;

      const res = await login();

      expect(res.status).toBe(400);
    });

    it("should return 400 if password is shorter than 8 characters", async () => {
      user.password = createStringOfNCharacters(7);

      const res = await login();

      expect(res.status).toBe(400);
    });

    it("should return 400 if password is longer than 256 characters", async () => {
      user.password = createStringOfNCharacters(257);

      const res = await login();

      expect(res.status).toBe(400);
    });

    it("should return 400 if user was not found", async () => {
      user.username = "nonExistingUsername";

      const res = await login();

      expect(res.status).toBe(400);
    });

    it("should return 400 if password did not match", async () => {
      user.password = "passwordThatDoesntmatch";

      const res = await login();

      expect(res.status).toBe(400);
    });

    it("should return 200 if valid data was passed", async () => {
      const res = await login();

      expect(res.status).toBe(200);
    });

    it("should return jwt if valid data was passed", async () => {
      const { body } = await login();

      expect(body).toHaveProperty("jwt");
    });

    login = () => {
      return request(server).post(`${apiEndpoint}/login`).send(user);
    };
  });
});
