const db = require('../config').mongoose;
const Post = require('../models/post');

const seeds = [
  {
    imageLink: '/uploads/57e345f90e463d4a38b887ade6a914ab.jpg',
    thumbnailLink: '/thumbnails/thumbnail_57e345f90e463d4a38b887ade6a914ab.jpg',
    source: 'None',
    tags: ['w12', 'auto', 'guide', 'akashi', 'unicorn', 'enterprise', 'light_carrier', 'repair_ship', 'light_cruiser'],
    rating: 'safe'
  }, {
    imageLink: '/uploads/e509abfd658a4c6bbb7ec7c67bef37d0.png',
    thumbnailLink: '/thumbnails/thumbnail_e509abfd658a4c6bbb7ec7c67bef37d0.png',
    source: 'None',
    tags: ['essex', 'unicorn', 'enterprise', 'portland', 'monarch', 'warspite', 'illustrious', 'neptune', 'helena', 'san diego'],
    rating: 'safe'
  }, {
    imageLink: '/uploads/865c59296d12be1b8e24c06814eccf1d.png',
    thumbnailLink: '/thumbnails/thumbnail_865c59296d12be1b8e24c06814eccf1d.png',
    source: 'wiki',
    tags: ['kitakaze', 'seattle', 'azuma', 'nagato', 'queen_elizabeth', 'mikasa', 'baltimore'],
    rating: 'safe'
  }
]

function randomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

async function seedDB() {
  console.log('starting seeding process');
  await Post.deleteMany({});
  console.log('cleared database');

  const elemsToAdd = 200;
  for (let i = 0; i < elemsToAdd; i++) {
    await Post.create(seeds[randomInt(seeds.length)]);
  }
  console.log(`successfully added ${elemsToAdd} elements to database`);
  console.log('done');
  db.disconnect();
}

seedDB();