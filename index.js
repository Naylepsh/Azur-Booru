const express = require('express'),
  app = express();

const indexRoutes = require('./routes/index.js');

app.use(indexRoutes);
  
app.listen(3000, () => {
    console.log('Booru server started at port 3000');
})