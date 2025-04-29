const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const PollingStation = require('./PollingStation');

const Elector = sequelize.define('Elector', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  serialNumber: {
    type: DataTypes.STRING,
    field: 'serialnumber',
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pollingStationId: {
    type: DataTypes.INTEGER,
    field: 'pollingstationid',
    references: {
      model: 'pollingstations',
      key: 'id',
    },
  },
}, {
  tableName: 'electors',
  timestamps: false,
});

module.exports = Elector;
