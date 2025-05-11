const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Constituency = sequelize.define('Constituency', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = Constituency;
