const express = require('express'),
  app = express(),
  mongoose = require('mongoose');

const indexRoutes = require('./routes/index.js'),
  postsRoutes = require('./routes/posts');

// APP CONFIG
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost/booru', { useNewUrlParser: true, useFindAndModify: false });

app.use(indexRoutes);
app.use('/posts', postsRoutes);
app.set('view engine', 'ejs');
  
app.listen(3000, () => {
    console.log('Booru server started at port 3000');
})