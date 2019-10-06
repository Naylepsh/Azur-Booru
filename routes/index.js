const express = require('express'),
  router = express();

router.get('/', (req, res) => {
  res.send('sup');
});

module.exports = router;