const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

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
    references: {
      model: 'Parties',  // Use table name as string
      key: 'id',
    },
  },
  constituencyId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Constituencies',  // Use table name as string
      key: 'id',
    },
  },
});

module.exports = Candidate;
