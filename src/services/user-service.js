const {UserRepository} = require('../repositories');
const {StatusCodes} = require('http-status-codes');
const AppErrors = require('../utils/error/app-errors');

const userRepo = new UserRepository();
console.log(userRepo);


async function userRegister(data){
    try {
        const user = await userRepo.create(data);
        return user;
    } catch (error) {
        console.log(error);
        let explanation=[];
    error.errors.forEach(err => explanation.push(err.message));
  
    if(error.name =='SequelizeValidationError' || error.name =='SequelizeUniqueConstraintError'){
        throw new AppErrors(explanation,StatusCodes.BAD_REQUEST);
    }
    Logger.error('Something went wrong in the User-service:userRegister');
       throw new AppErrors('Cannot create a new User object',StatusCodes.INTERNAL_SERVER_ERROR);

   
    }
}

module.exports={
    userRegister
}