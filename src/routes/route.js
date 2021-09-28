const express = require('express');

const { signUp, signIn } = require('../controller/authController');
const deposit = require('../controller/depositController')
const userAuthentication = require('../controller/userMiddleware');

const router = express.Router();

router.post('/', signUp);

router.get('/', signIn);

router.post('/deposit', userAuthentication, deposit);

module.exports = router;