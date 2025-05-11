const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Officer = sequelize.define('Officer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('returning_officer', 'registration_officer', 'polling_officer', 'presiding_officer'),
    allowNull: false,
  },
  pollingStationId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'PollingStations',  // Use table name as string
      key: 'id',
    },
  },
});

module.exports = Officer;
