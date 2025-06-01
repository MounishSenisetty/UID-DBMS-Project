const sequelize = require('../config/db');
const Party = require('../models/Party');
const Constituency = require('../models/Constituency');
const PollingStation = require('../models/PollingStation');
const Candidate = require('../models/Candidate');
const Officer = require('../models/Officer');
const Elector = require('../models/Elector');
const User = require('../models/User');
const Vote = require('../models/Vote');
const bcrypt = require('bcrypt');

async function populateDatabase() {
  try {
    console.log('Starting database population...');

    // Clear existing data (in reverse order of dependencies)
    await Vote.destroy({ where: {} });
    await Elector.destroy({ where: {} });
    await Officer.destroy({ where: {} });
    await Candidate.destroy({ where: {} });
    await PollingStation.destroy({ where: {} });
    await Constituency.destroy({ where: {} });
    await Party.destroy({ where: {} });
    await User.destroy({ where: {} });

    console.log('Existing data cleared.');

    // 1. Create Parties
    const parties = await Party.bulkCreate([
      { name: 'Indian National Congress', symbol: 'Hand' },
      { name: 'Bharatiya Janata Party', symbol: 'Lotus' },
      { name: 'Aam Aadmi Party', symbol: 'Broom' },
      { name: 'Communist Party of India', symbol: 'Hammer & Sickle' },
      { name: 'All India Trinamool Congress', symbol: 'Flower' }
    ]);
    console.log('Parties created:', parties.length);

    // 2. Create Constituencies
    const constituencies = await Constituency.bulkCreate([
      { 
        name: 'Mumbai North', 
        state: 'Maharashtra', 
        district: 'Mumbai', 
        code: 'MN001',
        description: 'Northern constituency of Mumbai'
      },
      { 
        name: 'Delhi East', 
        state: 'Delhi', 
        district: 'Delhi', 
        code: 'DE002',
        description: 'Eastern constituency of Delhi'
      },
      { 
        name: 'Kolkata South', 
        state: 'West Bengal', 
        district: 'Kolkata', 
        code: 'KS003',
        description: 'Southern constituency of Kolkata'
      },
      { 
        name: 'Chennai Central', 
        state: 'Tamil Nadu', 
        district: 'Chennai', 
        code: 'CC004',
        description: 'Central constituency of Chennai'
      },
      { 
        name: 'Bangalore North', 
        state: 'Karnataka', 
        district: 'Bangalore', 
        code: 'BN005',
        description: 'Northern constituency of Bangalore'
      }
    ]);
    console.log('Constituencies created:', constituencies.length);

    // 3. Create Polling Stations
    const pollingStations = await PollingStation.bulkCreate([
      { name: 'St. Mary\'s School', area: 'Bandra', ward: 'Ward 1', constituencyId: constituencies[0].id },
      { name: 'Government High School', area: 'Andheri', ward: 'Ward 2', constituencyId: constituencies[0].id },
      { name: 'Delhi Public School', area: 'Laxmi Nagar', ward: 'Ward 1', constituencyId: constituencies[1].id },
      { name: 'Kendriya Vidyalaya', area: 'Preet Vihar', ward: 'Ward 2', constituencyId: constituencies[1].id },
      { name: 'Modern High School', area: 'Ballygunge', ward: 'Ward 1', constituencyId: constituencies[2].id },
      { name: 'Don Bosco School', area: 'Park Street', ward: 'Ward 2', constituencyId: constituencies[2].id },
      { name: 'DAV School', area: 'T. Nagar', ward: 'Ward 1', constituencyId: constituencies[3].id },
      { name: 'Vivekananda School', area: 'Anna Nagar', ward: 'Ward 2', constituencyId: constituencies[3].id },
      { name: 'Bishop Cotton School', area: 'Malleshwaram', ward: 'Ward 1', constituencyId: constituencies[4].id },
      { name: 'National Public School', area: 'Jayanagar', ward: 'Ward 2', constituencyId: constituencies[4].id }
    ]);
    console.log('Polling Stations created:', pollingStations.length);

    // 4. Create Candidates
    const candidates = await Candidate.bulkCreate([
      { name: 'Rajesh Kumar', partyId: parties[0].id, constituencyId: constituencies[0].id },
      { name: 'Priya Sharma', partyId: parties[1].id, constituencyId: constituencies[0].id },
      { name: 'Amit Singh', partyId: parties[2].id, constituencyId: constituencies[0].id },
      
      { name: 'Sunita Verma', partyId: parties[0].id, constituencyId: constituencies[1].id },
      { name: 'Vikash Gupta', partyId: parties[1].id, constituencyId: constituencies[1].id },
      { name: 'Neha Agarwal', partyId: parties[3].id, constituencyId: constituencies[1].id },
      
      { name: 'Abhijit Banerjee', partyId: parties[4].id, constituencyId: constituencies[2].id },
      { name: 'Mamata Das', partyId: parties[0].id, constituencyId: constituencies[2].id },
      { name: 'Ravi Ghosh', partyId: parties[3].id, constituencyId: constituencies[2].id },
      
      { name: 'Lakshmi Raman', partyId: parties[0].id, constituencyId: constituencies[3].id },
      { name: 'Suresh Krishnan', partyId: parties[1].id, constituencyId: constituencies[3].id },
      { name: 'Kavitha Nair', partyId: parties[2].id, constituencyId: constituencies[3].id },
      
      { name: 'Ramesh Rao', partyId: parties[0].id, constituencyId: constituencies[4].id },
      { name: 'Geetha Reddy', partyId: parties[1].id, constituencyId: constituencies[4].id },
      { name: 'Manjunath Hegde', partyId: parties[2].id, constituencyId: constituencies[4].id }
    ]);
    console.log('Candidates created:', candidates.length);    // 5. Create Officers
    const officers = await Officer.bulkCreate([
      { name: 'Officer Raj Patel', role: 'presiding_officer', pollingStationId: pollingStations[0].id },
      { name: 'Officer Meera Shah', role: 'polling_officer', pollingStationId: pollingStations[1].id },
      { name: 'Officer Arun Kumar', role: 'presiding_officer', pollingStationId: pollingStations[2].id },
      { name: 'Officer Kavya Singh', role: 'polling_officer', pollingStationId: pollingStations[3].id },
      { name: 'Officer Subhash Chandra', role: 'presiding_officer', pollingStationId: pollingStations[4].id },
      { name: 'Officer Rina Das', role: 'polling_officer', pollingStationId: pollingStations[5].id },
      { name: 'Officer Venkat Raman', role: 'presiding_officer', pollingStationId: pollingStations[6].id },
      { name: 'Officer Divya Krishna', role: 'polling_officer', pollingStationId: pollingStations[7].id },
      { name: 'Officer Gopal Rao', role: 'presiding_officer', pollingStationId: pollingStations[8].id },
      { name: 'Officer Anita Reddy', role: 'polling_officer', pollingStationId: pollingStations[9].id }
    ]);
    console.log('Officers created:', officers.length);

    // 6. Create Electors
    const electors = [];
    for (let i = 0; i < pollingStations.length; i++) {
      const stationElectors = [];
      for (let j = 1; j <= 50; j++) {
        stationElectors.push({
          serialNumber: `${String(i + 1).padStart(2, '0')}${String(j).padStart(3, '0')}`,
          name: `Elector ${i + 1}-${j}`,
          pollingStationId: pollingStations[i].id
        });
      }
      electors.push(...stationElectors);
    }
    
    await Elector.bulkCreate(electors);
    console.log('Electors created:', electors.length);

    // 7. Create Users
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('password123', saltRounds);
    
    const users = await User.bulkCreate([
      {
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
        email: 'admin@election.gov',
        linkedId: null
      },
      {
        username: 'officer1',
        password: hashedPassword,
        role: 'presiding_officer',
        email: 'officer1@election.gov',
        linkedId: officers[0].id
      },
      {
        username: 'officer2',
        password: hashedPassword,
        role: 'polling_officer',
        email: 'officer2@election.gov',
        linkedId: officers[1].id
      },
      {
        username: 'elector1',
        password: hashedPassword,
        role: 'elector',
        email: 'elector1@email.com',
        linkedId: 1 // First elector
      },
      {
        username: 'elector2',
        password: hashedPassword,
        role: 'elector',
        email: 'elector2@email.com',
        linkedId: 2 // Second elector
      }
    ]);
    console.log('Users created:', users.length);

    // 8. Create some sample votes
    const sampleVotes = [
      { electorSerialNumber: '01001', candidateId: candidates[0].id, pollingStationId: pollingStations[0].id },
      { electorSerialNumber: '01002', candidateId: candidates[1].id, pollingStationId: pollingStations[0].id },
      { electorSerialNumber: '01003', candidateId: candidates[0].id, pollingStationId: pollingStations[0].id },
      { electorSerialNumber: '01004', candidateId: candidates[2].id, pollingStationId: pollingStations[0].id },
      { electorSerialNumber: '01005', candidateId: candidates[1].id, pollingStationId: pollingStations[0].id },
      
      { electorSerialNumber: '02001', candidateId: candidates[3].id, pollingStationId: pollingStations[2].id },
      { electorSerialNumber: '02002', candidateId: candidates[4].id, pollingStationId: pollingStations[2].id },
      { electorSerialNumber: '02003', candidateId: candidates[5].id, pollingStationId: pollingStations[2].id },
      { electorSerialNumber: '02004', candidateId: candidates[3].id, pollingStationId: pollingStations[2].id },
      { electorSerialNumber: '02005', candidateId: candidates[4].id, pollingStationId: pollingStations[2].id }
    ];

    await Vote.bulkCreate(sampleVotes);
    console.log('Sample votes created:', sampleVotes.length);

    console.log('\n=== Database Population Complete ===');
    console.log(`Parties: ${parties.length}`);
    console.log(`Constituencies: ${constituencies.length}`);
    console.log(`Polling Stations: ${pollingStations.length}`);
    console.log(`Candidates: ${candidates.length}`);
    console.log(`Officers: ${officers.length}`);
    console.log(`Electors: ${electors.length}`);
    console.log(`Users: ${users.length}`);
    console.log(`Votes: ${sampleVotes.length}`);

    console.log('\n=== Demo Login Credentials ===');
    console.log('Admin: username=admin, password=password123');
    console.log('Officer: username=officer1, password=password123');
    console.log('Elector: username=elector1, password=password123');

  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    await sequelize.close();
  }
}

populateDatabase();
