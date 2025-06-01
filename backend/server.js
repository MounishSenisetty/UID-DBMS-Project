const express = require('express');
const cors = require('cors');
const { sequelize, User, Elector, Vote, Candidate, Constituency, PollingStation, Officer, Party } = require('./models');
const pollingStationsRouter = require('./routes/pollingStations');
const officersRouter = require('./routes/officers');
const electorsRouter = require('./routes/electors');
const candidatesRouter = require('./routes/candidates');
const votesRouter = require('./routes/votes');
const partiesRouter = require('./routes/parties');
const constituenciesRouter = require('./routes/constituencies');
const authRouter = require('./routes/auth');
const { authenticateJWT } = require('./middleware/auth');
const app = express();

app.use(cors());
app.use(express.json());

// Test the connection with Sequelize
sequelize.authenticate()
  .then(() => console.log('Connected to PostgreSQL with Sequelize'))
  .catch((err) => console.error('Sequelize connection error:', err));

// Use auth router for authentication routes
app.use('/user', authRouter);

// Protected routes
app.use('/api/polling-stations', authenticateJWT, pollingStationsRouter);
app.use('/api/officers', authenticateJWT, officersRouter);
app.use('/api/electors', authenticateJWT, electorsRouter);
app.use('/api/candidates', authenticateJWT, candidatesRouter);
app.use('/api/votes', authenticateJWT, votesRouter);
app.use('/api/parties', authenticateJWT, partiesRouter);
app.use('/api/constituencies', authenticateJWT, constituenciesRouter);

const PORT = process.env.PORT || 5000;

app.get('/', async (req, res) => {
  try {
    const [result] = await sequelize.query('SELECT NOW()');
    res.send(`Current time from DB: ${result[0].now}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error querying the database');
  }
});

// Sync all models with the database
sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Error syncing database:', err);
});
