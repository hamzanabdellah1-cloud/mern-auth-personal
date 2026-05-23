require('dotenv').config({ quiet: true });

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const clientDistPath = path.join(__dirname, '../frontend/dist');
const allowedOrigins = (
  process.env.FRONTEND_URL || 'http://127.0.0.1:5173,http://localhost:5173'
)
  .split(',')
  .map((origin) => origin.trim());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Origin not allowed by CORS.'));
    },
  }),
);
app.use(express.json({ limit: '3mb' }));

app.get('/api/health', (req, res) => {
  res.json({
    message: 'API is running.',
    database:
      mongoose.connection.readyState === 1
        ? 'mongodb-connected'
        : 'mongodb-disconnected',
  });
});

app.use('/api/auth', authRoutes);
app.use(express.static(clientDistPath));

app.use((req, res) => {
  if (!req.path.startsWith('/api')) {
    return res.sendFile(path.join(clientDistPath, 'index.html'));
  }

  res.status(404).json({ message: 'Route not found.' });
});

app.use((error, req, res, next) => {
  console.error(error.message);
  res.status(500).json({ message: 'Server error. Please try again later.' });
});

async function connectDatabase() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is required to store users in MongoDB.');
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected.');
}

async function startServer() {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;
