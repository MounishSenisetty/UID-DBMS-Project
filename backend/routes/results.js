const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');
const Vote = require('../models/Vote');
const Candidate = require('../models/Candidate');
const Party = require('../models/Party');
const Elector = require('../models/Elector');
const PollingStation = require('../models/PollingStation');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

// Get vote counts by party filtered by constituency and ward
router.get('/', authenticateJWT, authorizeRoles('admin', 'returning_officer', 'presiding_officer'), async (req, res) => {
  try {
    const { constituencyId, ward } = req.query;

    // Build where clause for filtering electors by constituency and ward
    const electorWhere = {};
    if (constituencyId) {
      electorWhere.constituencyId = constituencyId;
    }
    if (ward) {
      electorWhere.ward = ward;
    }

    // Find electors matching filters
    const electors = await Elector.findAll({
      where: electorWhere,
      attributes: ['serialNumber'],
    });
    const electorSerialNumbers = electors.map(e => e.serialNumber);

    if (electorSerialNumbers.length === 0) {
      return res.json({ voteCounts: [], totalVotes: 0 });
    }

    // Count votes grouped by party for candidates voted by filtered electors
    const voteCounts = await Vote.findAll({
      where: {
        electorSerialNumber: electorSerialNumbers,
      },
      attributes: [
        'candidateId',
        [Sequelize.fn('COUNT', Sequelize.col('candidateId')), 'voteCount'],
      ],
      group: ['candidateId'],
      include: [{
        model: Candidate,
        include: [Party],
      }],
    });

    // Aggregate votes by party
    const partyVotes = {};
    let totalVotes = 0;
    voteCounts.forEach(vc => {
      const partyName = vc.Candidate.Party ? vc.Candidate.Party.name : 'Independent';
      const count = parseInt(vc.dataValues.voteCount, 10);
      totalVotes += count;
      if (!partyVotes[partyName]) {
        partyVotes[partyName] = 0;
      }
      partyVotes[partyName] += count;
    });

    res.json({ partyVotes, totalVotes });
  } catch (error) {
    console.error('Error fetching filtered results:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
