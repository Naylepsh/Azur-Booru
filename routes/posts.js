const express = require('express'),
  router = express();

router.get('/', (req, res) => {
  res.render('posts/index');
});

router.get('/new', (req, res) => {
  res.render('posts/new');
});

module.exports = router;