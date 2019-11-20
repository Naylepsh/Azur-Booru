const express = require('express'),
  router = express(),
  jimp = require('jimp'),
  Storage = require('../utils').Storage,
  Post = require('../models/post');

const IMAGES_PER_PAGE = 20;

async function getTagList(tagNames) {
  /* takes set ot tag names and returns a list of tags and their number of occurences in database */
  let tags = [];
  for (const tag of tagNames) {
    const occurences = await Post.countDocuments({tags: tag});
    tags.push({name: tag, occurences: occurences});
  }
  return tags;
}

async function makeThumbnail(pathToFile, pathToThumbnail) {
  const image = await jimp.read(pathToFile);
  let thumbnail = image.clone();
  thumbnail.cover(200, 200);
  await thumbnail.writeAsync(pathToThumbnail);
}

router.get('/', async (req, res) => {
  try {
    const tags = req.query.tags === undefined ? 
      {} : 
      {tags: { '$all' : req.query.tags.split(' ').filter( tag => tag.length > 0) }};
    const tagsQuery = req.query.tags === undefined ?
      undefined :
      `tags=${req.query.tags.replace(/ /g, '+')}`;

    // get the number of records
    const count = await Post.countDocuments(tags);

    // set the page info
    const last_page = Math.ceil(count / IMAGES_PER_PAGE);
    const current_page = req.query.page ? parseInt(req.query.page) : 1;

    // get n-th 30 images
    let posts = await Post
    .find(tags)
    .sort({ _id: -1 })
    .skip((current_page - 1)*IMAGES_PER_PAGE)
    .limit(IMAGES_PER_PAGE);

    // get all tags of those images
    const tagNames = new Set([].concat.apply([], posts.map( post => post.tags)));
    const tagList = await getTagList(tagNames);

    res.render('posts/index', {
      posts: posts,
      tags: tagList,
      tagsQuery: tagsQuery, 
      page_info: {
        last_page: last_page, 
        current_page: current_page
      }});

  } catch(err) {
    console.log(err);
  }
});

router.get('/new', (req, res) => {
  res.render('posts/new');
});

router.post('/', Storage.single('image'), async (req, res) => {
  try {
    await makeThumbnail(`./public/uploads/${req.file.filename}`, `./public/thumbnails/thumbnail_${req.file.filename}`);
    const post = await Post.create({
      imageLink: `/uploads/${req.file.filename}`,
      thumbnailLink: `/thumbnails/thumbnail_${req.file.filename}`,
      source: req.body.source,
      title: req.body.title,
      tags: req.body.tags.split(' ').filter( tag => tag.length > 0)
    });
    console.log(post);
    res.redirect('/posts');
  } catch(err) {
    console.log(err);
    res.redirect('/')
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post
    .findById(req.params.id);
    
    const tags = await getTagList(post.tags);
    res.render('posts/show', {post: post, tags: tags});
  } catch(err) {
    console.log(err);
    res.redirect('/');
  }
});

module.exports = router;