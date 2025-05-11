const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Vote = sequelize.define('Vote', {
  electorSerialNumber: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Electors',
      key: 'serialNumber',
    },
  },
  candidateId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Candidates',
      key: 'id',
    },
  },
});

module.exports = Vote;
