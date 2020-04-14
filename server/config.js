const env = process.env.NODE_ENV;

const dev = {
  app: {
    port: 3000,
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
  requireAuth: false,
};

const config = {
  dev,
};

module.exports = config[env];
