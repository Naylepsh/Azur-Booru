const mongoose = require('mongoose'),
  Post = require('../../models/post');

const seeds = [
  {
    imageLink: '/uploads/57e345f90e463d4a38b887ade6a914ab.jpg',
    thumbnailLink: '/thumbnails/thumbnail_57e345f90e463d4a38b887ade6a914ab.jpg',
    source: 'None',
    tags: ['w12', 'auto', 'guide', 'akashi', 'unicorn', 'enterprise', 'light_carrier', 'repair_ship', 'light_cruiser']
  }, {
    imageLink: '/uploads/e509abfd658a4c6bbb7ec7c67bef37d0.png',
    thumbnailLink: '/thumbnails/thumbnail_e509abfd658a4c6bbb7ec7c67bef37d0.png',
    source: 'None',
    tags: ['essex', 'unicorn', 'enterprise', 'portland', 'monarch', 'warspite', 'illustrious', 'neptune', 'helena', 'san diego']
  }, {
    imageLink: '/uploads/865c59296d12be1b8e24c06814eccf1d.png',
    thumbnailLink: '/thumbnails/thumbnail_865c59296d12be1b8e24c06814eccf1d.png',
    source: 'wiki',
    tags: ['kitakaze', 'seattle', 'azuma', 'nagato', 'queen_elizabeth', 'mikasa', 'baltimore']
  }
]

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

async function seedDB() {
  await Post.deleteMany({});

  for (let i = 0; i < 200; i++) {
    await Post.create(seeds[getRandomInt(seeds.length)]);
  }
}

module.exports = seedDB;