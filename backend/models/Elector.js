const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Elector = sequelize.define('Elector', {
  serialNumber: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
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

module.exports = Elector;
