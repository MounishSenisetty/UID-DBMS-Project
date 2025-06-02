const sequelize = require('../config/db');

const User = require('./User');
const Elector = require('./Elector');
const Vote = require('./Vote');
const Candidate = require('./Candidate');
const Constituency = require('./Constituency');
const PollingStation = require('./PollingStation');
const Officer = require('./Officer');
const Party = require('./Party');

// Define associations

Elector.belongsTo(PollingStation, { foreignKey: 'pollingStationId' });
PollingStation.hasMany(Elector, { foreignKey: 'pollingStationId' });

Elector.hasOne(Vote, { foreignKey: 'electorSerialNumber', sourceKey: 'serialNumber' });
Vote.belongsTo(Elector, { foreignKey: 'electorSerialNumber', targetKey: 'serialNumber' });

Vote.belongsTo(Candidate, { foreignKey: 'candidateId' });
Candidate.hasMany(Vote, { foreignKey: 'candidateId' });

Candidate.belongsTo(Party, { foreignKey: 'partyId' });
Party.hasMany(Candidate, { foreignKey: 'partyId' });

Candidate.belongsTo(Constituency, { foreignKey: 'constituencyId' });
Constituency.hasMany(Candidate, { foreignKey: 'constituencyId' });

PollingStation.belongsTo(Constituency, { foreignKey: 'constituencyId' });
Constituency.hasMany(PollingStation, { foreignKey: 'constituencyId' });

PollingStation.hasMany(Officer, { foreignKey: 'pollingStationId' });
Officer.belongsTo(PollingStation, { foreignKey: 'pollingStationId' });

module.exports = {
  sequelize,
  User,
  Elector,
  Vote,
  Candidate,
  Constituency,
  PollingStation,
  Officer,
  Party,
};
