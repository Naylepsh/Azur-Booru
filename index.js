const express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  seedDB = require('./utils/lib/seeds');
  // Post = require('./models/post');

const indexRoutes = require('./routes/index.js'),
  postsRoutes = require('./routes/posts');

// Mongo Config
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost/booru', { useNewUrlParser: true, useFindAndModify: false });

// App Config
app.use(bodyParser.urlencoded({extended: true}));
app.use(indexRoutes);
app.use('/posts', postsRoutes);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// Populating DB
// seedDB();
  
app.listen(3000, () => {
    console.log('Booru server started at port 3000');
});