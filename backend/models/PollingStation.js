const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PollingStation = sequelize.define('PollingStation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  area: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ward: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  constituencyId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Constituencies',  // Use table name as string
      key: 'id',
    },
  },
});

module.exports = PollingStation;
