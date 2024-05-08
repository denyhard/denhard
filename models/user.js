const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("./index");

class User extends Model {}

User.init(
  {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    institusi: DataTypes.STRING,
    admin: DataTypes.BOOLEAN,
  },
  { sequelize, modelName: "user" }
);

module.exports = User;
