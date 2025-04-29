const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const pollingStationsRouter = require('./routes/pollingStations');
const officersRouter = require('./routes/officers');
const electorsRouter = require('./routes/electors');
const candidatesRouter = require('./routes/candidates');
const votesRouter = require('./routes/votes');
const partiesRouter = require('./routes/parties');
const authRouter = require('./routes/auth');
const { authenticateJWT } = require('./middleware/auth');
const app = express();
const constituenciesRouter = require('./routes/constituencies');

// Enable CORS with options to allow frontend origin
app.use(cors({
  origin: 'http://localhost:5173', // Adjust this to your frontend URL and port
  credentials: true,
}));

app.use(express.json());

// Use auth router for authentication routes
app.use('/user', authRouter);

// Protected routes
app.use('/api/constituencies', authenticateJWT, constituenciesRouter);
app.use('/api/polling-stations', authenticateJWT, pollingStationsRouter);
app.use('/api/officers', authenticateJWT, officersRouter);
app.use('/api/electors', authenticateJWT, electorsRouter);
app.use('/api/candidates', authenticateJWT, candidatesRouter);
app.use('/api/votes', authenticateJWT, votesRouter);
app.use('/api/parties', authenticateJWT, partiesRouter);
const resultsRouter = require('./routes/results');
app.use('/api/results', authenticateJWT, resultsRouter);

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Error handling middleware to log errors with stack trace
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack || err);
  res.status(500).json({ error: 'Internal Server Error' });
});
