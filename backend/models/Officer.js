const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const PollingStation = require('./PollingStation');

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
    type: DataTypes.ENUM('returning', 'registration', 'polling', 'presiding'),
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
  tableName: 'officers',
  timestamps: false,
});

module.exports = Officer;
