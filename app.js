require('dotenv').config();
const config = require('./config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');

if (!process.env.JWT_SECRET) {
  console.error('JWT SECRET is not defined');
  process.exit(1);
}

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
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(logger('dev'));
app.use(methodOverride('_method'));
app.use(indexRoutes);
app.use('/posts', postsRoutes);
app.use('/', userRoutes);

module.exports = app;