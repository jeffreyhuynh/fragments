// src/index.js

const logger = require('./logger');

require('dotenv').config();

process.on('uncaughtException', (err, origin) => {
  logger.fatal({ err, origin }, 'uncaughtException');
  throw err;
});

process.on('unhandledRejection', (reason, promise) => {
  logger.fatal({ reason, promise }, 'unhandledRejection');
  throw reason;
});

require('./server');
