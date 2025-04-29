const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Elector = require('./Elector');
const Candidate = require('./Candidate');

const Vote = sequelize.define('Vote', {
  electorSerialNumber: {
    type: DataTypes.STRING,
    field: 'electorserialnumber',
    primaryKey: true,
    references: {
      model: 'electors',
      key: 'serialnumber',
    },
  },
  candidateId: {
    type: DataTypes.INTEGER,
    field: 'candidateid',
    allowNull: false,
    references: {
      model: 'candidates',
      key: 'id',
    },
  },
}, {
  tableName: 'votes',
  timestamps: false,
});

module.exports = Vote;
