const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PoliticalParty = sequelize.define('PoliticalParty', {
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
  abbreviation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  foundedYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  ideology: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'politicalparties',
  timestamps: false,
});

module.exports = PoliticalParty;
