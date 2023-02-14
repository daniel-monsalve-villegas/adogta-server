require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bb = require('express-busboy');

// App instance
const app = express();
const config = require('./config');

// Route system
const routes = require('./routers/routes');

app.use(cors());
app.use(express.json());
bb.extend(app, {
  upload: true,
  path: 'uploads',
  allowedPath: /./,
  mimeTypeLimit: ['image/jpeg', 'image/png'],
});

if (process.env.NODE_ENV === 'test') {
  mongoose.connect(
    config.dbConnectionStringTest,
    console.log('Connected to db-test'),
  );
} else {
  mongoose.connect(config.dbConnectionString, console.log('Connected to db'));
}

mongoose.connection.on('error', (e) => {
  console.error(e);
  process.exit(1);
});

// routes that will be used
app.use(routes);

// manage errors
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

module.exports = app;
