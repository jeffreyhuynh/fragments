// src/index.js

require('dotenv').config();

const logger = require('./logger');

process.on('uncaughtException', (err, origin) => {
  logger.fatal({ err, origin }, 'uncaughtException');
  throw err;
});

process.on('unhandledRejection', (reason, promise) => {
  logger.fatal({ reason, promise }, 'unhandledRejection');
  throw reason;
});

require('./server');

// Testing lint
if (1 + 2) {
}
