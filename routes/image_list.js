const express = require('express'),
  router = express();

router.get('/', (req, res) => {
  res.render('image_list');
});

module.exports = router;