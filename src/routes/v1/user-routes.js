const express = require('express');
const { UserMiddleware } = require('../../middlewares');
const { UserController } = require('../../controllers');
const router = express.Router();


router.post('/signup',UserMiddleware.validateUser, UserController.signUp);

router.post('/signin',UserMiddleware.validateUser, UserController.signIn);

module.exports=router;