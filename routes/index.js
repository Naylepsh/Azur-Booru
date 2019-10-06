const express = require('express'),
  router = express();

router.get('/', (req, res) => {
  res.render('landing');
});

module.exports = router;