const { StatusCodes } = require("http-status-codes");
const {ErrorResponse} = require('../utils/common');
const AppErrors = require("../utils/error/app-errors");

function validateUser(req,res,next){
    if(!req.body.email){
        ErrorResponse.message="Something went wrong while creating the user"
        ErrorResponse.error= new AppErrors([' email  is not found in the oncoming request in correct form!'],StatusCodes.BAD_REQUEST);

        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    if(!req.body.password){
        ErrorResponse.message="Something went wrong while creating the user"
        ErrorResponse.error= new AppErrors([' password  is not found in the oncoming request in correct form!'],BAD_REQUEST);

        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    next();
}


module.exports={validateUser}