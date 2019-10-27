const express = require('express'),
  router = express(),
  fs = require('fs'),
  Storage = require('../utils').Storage,
  Image = require('../models/image');

const IMAGES_PER_PAGE = 20;

router.get('/', async (req, res) => {
  try {
    // get the number of records
    const count = await Image.countDocuments({});

    // set the page info
    const n = Math.floor(count / IMAGES_PER_PAGE);
    const current_page = 1;

    // get n-th 30 images
    const binaryImages = await Image
    .find({})
    .limit(IMAGES_PER_PAGE);
    const images = binaryImages.map( image => {
      const base64Flag = 'data:' + image.contentType + ';base64,';
      const imageString = image.data.toString('base64');
      return base64Flag + imageString;
    });

    res.render('posts/index', {
      images: images, 
      page_info: {
        n: n, 
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
    const image = await Image.create({
    data: fs.readFileSync(req.file.path),
    contentType: req.file.mimetype});
    fs.unlinkSync(req.file.path);
    res.redirect('/posts');
  } catch (err){
    console.log(err);
    res.redirect('/get');
  }
});

module.exports = router;