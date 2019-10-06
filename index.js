const express = require('express'),
  app = express();

const indexRoutes = require('./routes/index.js');

// APP CONFIG
app.use(indexRoutes);
app.set('view engine', 'ejs');
  
app.listen(3000, () => {
    console.log('Booru server started at port 3000');
})