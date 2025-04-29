const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PollingStation = require('./PollingStation');
const Candidate = require('./Candidate');

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
}, {
  tableName: 'constituencies',
  timestamps: false,
});

module.exports = Constituency;
