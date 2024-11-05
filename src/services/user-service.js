const {UserRepository} = require('../repositories');
const {StatusCodes} = require('http-status-codes');
const AppErrors = require('../utils/error/app-errors');
const { Auth } = require('../utils/common');
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

async function signIn(data){
  try {
    const user = await userRepo.getEmailId(data.email);
    console.log("user ",user);
    if(!user){
        throw new AppErrors('no user found for given email',StatusCodes.NOT_FOUND);
    }
    const plainPassword = data.password;
    const encryptPassword= user.password;
   const isPasswordMatch = Auth.checkPassword(plainPassword,encryptPassword);

   if(!isPasswordMatch){
    throw new AppErrors('Invalid password', StatusCodes.BAD_REQUEST);
   }

   const jwtToken = Auth.createToken({id:user.id,email:user.email});
 
    return jwtToken;
  } catch (error) {
    if(error instanceof AppErrors) throw error;
    console.log(error);
    throw new AppErrors('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}



module.exports={
    userRegister,
    signIn
}