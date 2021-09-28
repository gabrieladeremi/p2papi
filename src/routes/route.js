const express = require('express');

const { signUp, signIn } = require('../controller/authController');
const userAuthentication = require('../controller/userMiddleware');
const deposit = require('../controller/depositController');
const transfer = require('../controller/transferController');
const balance = require('../controller/balanceController');

const router = express.Router();

router.post('/', signUp);

router.get('/', signIn);

router.post('/deposit', userAuthentication, deposit);

router.post('/transfer', userAuthentication, transfer);
router.get('/balance', userAuthentication, balance);

module.exports = router;