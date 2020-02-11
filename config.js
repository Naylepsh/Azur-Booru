const env = process.env.NODE_ENV;

const dev = {
  app: {
    port: 3000
  },
  db: {
    host: 'localhost',
    name: 'booru'
  },
};

const config = {
  dev,
};

module.exports = config[env];