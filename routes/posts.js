const express = require('express'),
  router = express(),
  fs = require('fs'),
  StorageUtils = require('../utils').Storage,
  Storage = StorageUtils.initStorage(),
  Image = require('../models/image');

const IMAGES_PER_PAGE = 20;

router.get('/', async (req, res) => {
  try {
    // get the number of records
    const count = await Image.countDocuments({});

    // set the page info
    const max_page = Math.ceil(count / IMAGES_PER_PAGE);
    const page = req.query.page ? req.query.page : 1;

    // get n-th 30 images
    const binaryImages = await Image
    .find({})
    .skip((page - 1)*IMAGES_PER_PAGE)
    .limit(IMAGES_PER_PAGE);
    // const images = binaryImages.map( StorageUtils.binImgToStrImg );
    const images = binaryImages.map( image => {
      return {
        _id: image._id,
        data: StorageUtils.binImgToStrImg(image)}
    });

    res.render('posts/index', {
      images: images, 
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

router.get('/:id', async (req, res) => {
  try {
    const binImage = await Image.findById(req.params.id);
    console.log(binImage);
    const image = StorageUtils.binImgToStrImg(binImage);
    res.render('posts/show', {image: image});
  } catch(err) {
    console.log(err);
    res.redirect('/');
  }
});

module.exports = router;