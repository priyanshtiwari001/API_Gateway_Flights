const {UserRepository,RoleRepository} = require('../repositories');
const {StatusCodes} = require('http-status-codes');
const AppErrors = require('../utils/error/app-errors');
const { Auth,Enums } = require('../utils/common');
const userRepo = new UserRepository();
const roleRepo = new RoleRepository();


async function userRegister(data){
    try {
        const user = await userRepo.create(data);
        const role = await roleRepo.getRoleByName(Enums.USER_ROLES_ENUMS.CUSTOMER);
        // console.log(role);
        user.addRole(role); // due to assoication we can able to do that-> also it will ad the userId and roleId in userole table.
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


async function isAuthenicated(token){
   try {
    if(!token){
        throw new AppErrors('Missing JWT token',StatusCodes.BAD_REQUEST);
    }

    const response = Auth.verifyToken(token);
    const user = await userRepo.get(response.id);
    if(!user) {
        throw new AppErrors('No user found', StatusCodes.NOT_FOUND);
    }
    return user.id;

   } catch (error) {
    console.log(error);
    if(error instanceof AppErrors) throw error;
    if(error.name == 'JsonWebTokenError'){
        throw new AppErrors('Invaild JWT token', StatusCodes.BAD_REQUEST);
    }
    if(error.name =="TokenExpiredError"){
        throw new AppErrors('JWT token Expired',StatusCodes.UNAUTHORIZED);
    }

    throw error;
   }
}


async function addRoleToUser(data){
    try{
        const user = await userRepo.get(data.id);
       
        if(!user) {
            throw new AppErrors('No user found for given Id', StatusCodes.NOT_FOUND);
        }
        const role = await roleRepo.getRoleByName(data.role);
       
        if(!role) {
            throw new AppErrors('No role found for given name', StatusCodes.NOT_FOUND);
        }
        user.addRole(role);
        return user;
    }catch(error){
        if(error instanceof AppErrors) throw error;
        console.log(error);
        throw new AppErrors('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }


}


async function isAdmin(id){
   try {
    const user = await userRepo.get(id);
    if(!user) {
        throw new AppErrors('No user found for given Id', StatusCodes.NOT_FOUND);
    }
    const adminRole = await roleRepo.getRoleByName(Enums.USER_ROLES_ENUMS.ADMIN);
    if(!adminRole) {
        throw new AppErrors('No role found for given name', StatusCodes.NOT_FOUND);
    }
   return  user.hasRole(adminRole);
   } catch (error) {
    if(error instanceof AppErrors) throw error;
        console.log(error);
        throw new AppErrors('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
   }
}

module.exports={
    userRegister,
    signIn,
    isAuthenicated,
    addRoleToUser,
    isAdmin
}