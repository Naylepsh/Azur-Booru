const express = require('express'),
  router = express(),
  fs = require('fs'),
  Storage = require('../utils').Storage,
  Image = require('../models/image');

router.get('/', (req, res) => {
  // find 30 posts and print them

  // working image test
  Image.find({}, (err, binaryImages) => {
    if (err) {
      console.log(err);
    } else {
      images = [];
      for (const image of binaryImages){
        const base64Flag = 'data:' + image.contentType + ';base64,';
        const imageString = image.data.toString('base64');
        images.push(base64Flag + imageString);
      }
      res.render('posts/index', {images: images});
    }
  });
});

router.get('/new', (req, res) => {
  res.render('posts/new');
});

router.post('/', Storage.single('image'), (req, res) => {
  Image.create({
    data: fs.readFileSync(req.file.path),
    contentType: req.file.mimetype
  }), (err, img) => {
    if (err) {
        console.log(err);
    } else {
        console.log(img);
    }
  };
  fs.unlinkSync(req.file.path);
  res.redirect('/posts');
});

module.exports = router;