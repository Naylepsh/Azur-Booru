const express = require('express');
const router = express();
const User = require('../controllers/userController');

router
.get('/register', User.registerForm)
.post('/register', User.register)
.get('/login', User.loginForm)
.post('/login', User.login);

module.exports = router;