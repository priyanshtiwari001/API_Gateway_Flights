const { StatusCodes } = require("http-status-codes");
const {ErrorResponse} = require('../utils/common');
const AppErrors = require("../utils/error/app-errors");
const { UserService } = require("../services");

function validateUser(req,res,next){
    if(!req.body.email){
        ErrorResponse.message="Something went wrong while authenticating the user"
        ErrorResponse.error= new AppErrors([' email  is not found in the oncoming request in correct form!'],StatusCodes.BAD_REQUEST);

        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    if(!req.body.password){
        ErrorResponse.message="Something went wrong while authenticating the user"
        ErrorResponse.error= new AppErrors([' password  is not found in the oncoming request in correct form!'],BAD_REQUEST);

        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    next();
}


 async function checkAuth(req,res,next){
   try {
    const response = await UserService.isAuthenicated(req.headers['x-access-token']);
    
    if(response){
        req.user=response; // setting the user id in req object
        console.log(response)
        next();
    }

   } catch (error) {
     return res
                .status(error.statusCode)
                .json(error);
   }
}

async function isAdmin(req,res,next){
    
    const response = await UserService.isAdmin(req.user);
    console.log('isAdmin',response);
    if(!response){
        return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({
         message:"you don\'t have permission to do this action"
        });
    }
    next();

    
}

module.exports={validateUser,checkAuth,isAdmin}