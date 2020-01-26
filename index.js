const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./config').mongoose;

const indexRoutes = require('./routes/index.js');
const postsRoutes = require('./routes/posts');

const PORT = 3000;

// App Config
app.use(bodyParser.urlencoded({extended: true}));
app.use(indexRoutes);
app.use('/posts', postsRoutes);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
  
app.listen(PORT, () => {
    console.log(`Booru server started at port ${PORT}`);
});