const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("./index");

class Journal extends Model {}

Journal.init(
  {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    fileUrl: DataTypes.STRING,
    revision: DataTypes.TEXT,
    status: DataTypes.ENUM("approved", "pending", "declined"),
  },
  { sequelize, modelName: "journal" }
);

const User = require('./user')

// Establish the relationship
Journal.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Journal, { foreignKey: 'userId' });

module.exports = Journal;
