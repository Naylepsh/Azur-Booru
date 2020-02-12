const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const logger = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const config = require('./config');

const indexRoutes = require('./routes/index');
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

// DB config
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.connect(
  `mongodb://${config.db.host}/${config.db.name}`,
  { useNewUrlParser: true, useFindAndModify: false }
);

// App Config
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(logger('dev'));
app.use(methodOverride('_method'));
app.use(indexRoutes);
app.use('/posts', postsRoutes);
app.use('/', userRoutes);

module.exports = app;