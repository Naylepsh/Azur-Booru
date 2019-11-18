const mongoose = require('mongoose'),
  Post = require('../../models/post');

const seeds = [
  {
    imageLink: '/uploads/7fa85d0857282a8920dcdf6d1b9a4a31.jpg',
    source: 'None',
    tags: ['w12', 'auto', 'guide', 'akashi', 'unicorn', 'enterprise', 'light_carrier', 'repair_ship', 'light_cruiser']
  }, {
    imageLink: '/uploads/35a788836126c1c6807e978eee34846f.png',
    source: 'None',
    tags: ['essex', 'unicorn', 'enterprise', 'portland', 'monarch', 'warspite', 'illustrious', 'neptune', 'helena', 'san diego']
  }
]

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

async function seedDB() {
  await Post.deleteMany({});

  for (let i = 0; i < 200; i++) {
    await Post.create(seeds[getRandomInt(2)]);
  }
}

module.exports = seedDB;