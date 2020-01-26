const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const logger = require('morgan');
const db = require('./config').mongoose;

const indexRoutes = require('./routes/index.js');
const postsRoutes = require('./routes/posts');

const PORT = 3000;

// App Config
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(logger('dev'));
app.use(indexRoutes);
app.use('/posts', postsRoutes);

  
app.listen(PORT, () => {
    console.log(`Booru server started at port ${PORT}`);
});