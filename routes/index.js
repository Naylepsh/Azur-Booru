const express = require('express');
const router = express();

router.get('/', (req, res) => {
  res.render('landing', { user: req.user });
});

module.exports = router;