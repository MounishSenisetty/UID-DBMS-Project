const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Party = sequelize.define('Party', {
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
  symbol: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Party;