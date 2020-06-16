const env = process.env.NODE_ENV;
require("dotenv").config();

const dev = {
  app: {
    port: 3001,
  },
  db: {
    URI: process.env.MONGODB_URI,
  },
  bucket: {
    name: process.env.GOOGLE_CLOUD_BUCKET_NAME,
  },
  cookies: {
    prefix: "AzurBooru_",
  },
  requireAuth: true,
};

const test = {
  app: {
    port: 3002,
  },
  db: {
    URI: process.env.MONGODB_TEST_URI,
  },
  cookies: {
    prefix: "AzurBooru_",
  },
  requireAuth: true,
};

const config = {
  dev,
  test,
};

module.exports = config[env];
