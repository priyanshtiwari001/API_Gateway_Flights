const { StatusCodes } = require("http-status-codes");
const { UserService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/common");


async function signUp(req,res){
    console.log(req.body);
    try {
        const user = await UserService.userRegister({
           email:req.body.email,
           password:req.body.password
        });
        SuccessResponse.data=user;
        return res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
        console.log(error)
        ErrorResponse.error=error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

module.exports={
    signUp
}