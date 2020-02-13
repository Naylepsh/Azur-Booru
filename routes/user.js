const express = require('express');
const router = express();
const User = require('../controllers/userController');
const { authorizeUser } = require('../middleware/auth');

router
.get('/register', User.registerForm)
.post('/register', User.register)
.get('/login', User.loginForm)
.post('/login', User.login)
.get('/logout', User.logout)
.get('/profile', authorizeUser, User.profile);

module.exports = router;