const express = require('express'),
  router = express(),
  fs = require('fs'),
  Storage = require('../utils').Storage,
  Image = require('../models/image'),
  Post = require('../models/post');

const IMAGES_PER_PAGE = 20;

function binImgToStrImg(data, contentType){
  const base64Flag = 'data:' + contentType + ';base64,';
  const imageString = data.toString('base64');
  return base64Flag + imageString;
}

async function createImage(file){
  const image = await Image.create({
    contentType: file.mimetype,
    data: binImgToStrImg(fs.readFileSync(file.path), file.mimetype)});
  fs.unlinkSync(file.path);
  return image;
}

function formatTagsQuery(tags){
  return {tags: { '$all' : tags.split(' ').filter( tag => tag.length > 0) }};
}

router.get('/', async (req, res) => {
  try {
    const tagsQuery = req.query.tags === undefined ? {} : formatTagsQuery(req.query.tags);

    // get the number of records
    const count = await Post.countDocuments(tagsQuery);

    // set the page info
    const max_page = Math.ceil(count / IMAGES_PER_PAGE);
    const page = req.query.page ? req.query.page : 1;

    // get n-th 30 images
    let posts = await Post
    .find(tagsQuery)
    .skip((page - 1)*IMAGES_PER_PAGE)
    .limit(IMAGES_PER_PAGE)
    .populate('image');

    res.render('posts/index', {
      posts: posts, 
      page_info: {
        max_page: max_page, 
        page: page
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
    const image = await createImage(req.file);
    const post = await Post.create({
      image: image._id,
      source: req.body.source,
      title: req.body.title,
      tags: req.body.tags.split(' ').filter( tag => tag.length > 0)
    });
    res.redirect('/posts');
  } catch(err) {
    console.log(err);
    res.redirect('/')
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post
    .findById(req.params.id)
    .populate('image');
    
    res.render('posts/show', {post: post});
  } catch(err) {
    console.log(err);
    res.redirect('/');
  }
});

module.exports = router;