const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const seedDB = require('./utils/lib/seeds');

const indexRoutes = require('./routes/index.js');
const postsRoutes = require('./routes/posts');

const PORT = 3000;

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
seedDB();
  
app.listen(PORT, () => {
    console.log(`Booru server started at port ${PORT}`);
});