const env = process.env.NODE_ENV;

const dev = {
  app: {
    port: 3000,
  },
  db: {
    URI: process.env.MONGODB_URI,
  },
  cookies: {
    prefix: "AzurBooru_",
  },
};

const config = {
  dev,
};

module.exports = config[env];
