'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcrypt');
const {ServerConfig} = require('../config')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    email: 
    {
      type:DataTypes.STRING,
      allowNull:false,
      unique:true,
      validate:{
        isEmail:true,
      }
    },
    password:{ 
      type: DataTypes.STRING,
      allowNull:false,
      
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.addHook('beforeCreate', function encyrpt(user){
    console.log('user before encrypt',user);
    const encryptPassword = bcrypt.hashSync(user.password, +ServerConfig.SALTY_ROUND);
    user.password=encryptPassword;
    console.log('user after encrypt',user);
  })
  return User;
};