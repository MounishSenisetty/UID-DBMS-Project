const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Constituency = require('./Constituency');
const Officer = require('./Officer');
const Elector = require('./Elector');

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
    field: 'constituencyid',
    references: {
      model: 'constituencies',
      key: 'id',
    },
  },
}, {
  tableName: 'pollingstations',
  timestamps: false,
});

module.exports = PollingStation;
