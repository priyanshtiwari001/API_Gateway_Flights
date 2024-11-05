const express = require('express');
const { UserMiddleware } = require('../../middlewares');
const { UserController } = require('../../controllers');
const router = express.Router();


router.post('/',UserMiddleware.validateUser, UserController.signUp);


module.exports=router;