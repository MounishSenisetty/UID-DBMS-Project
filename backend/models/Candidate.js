const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Party = require('./Party');

const Vote = require('./Vote');

const Candidate = sequelize.define('Candidate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  partyId: {
    type: DataTypes.INTEGER,
    field: 'partyid',
    references: {
      model: 'parties',
      key: 'id',
    },
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
  tableName: 'candidates',
  timestamps: false,
});

module.exports = Candidate;
