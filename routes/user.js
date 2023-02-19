const express = require('express');
const router = express.Router();
const userSchema = require('../schema/user')
const userController = require('../controller/userController')
// const verify = require('../middleware/auth')




router.post('/register',userSchema.userCreate, userController.register);
router.post('/login', userSchema.userLogin, userController.login);


module.exports = router