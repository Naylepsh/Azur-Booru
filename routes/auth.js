const express = require('express');
const router = express();
const Auth = require('../controllers/authController');

router
.get('/login', Auth.loginForm)
.get('/register', Auth.registerForm);

module.exports = router;