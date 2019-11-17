const mongoose = require('mongoose'),
  Post = require('../../models/post');

const seed = {
  imageLink: '/uploads/7fa85d0857282a8920dcdf6d1b9a4a31.jpg',
  source: 'None',
  tags: ['w12', 'auto', 'guide', 'akashi', 'unicorn', 'enterprise', 'light_carrier', 'repair_ship', 'light_cruiser']
}

async function seedDB() {
  await Post.deleteMany({});

  for (let i = 0; i < 100; i++) {
    await Post.create(seed);
  }
}

module.exports = seedDB;