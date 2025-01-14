// src/app.js

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const passport = require('passport');
const authorization = require('./authorization');
const { createErrorResponse } = require('./response');

const logger = require('./logger');
const pino = require('pino-http')({
  logger,
});

const app = express();

app.use(pino);
app.use(helmet());
app.use(cors());
app.use(compression());

passport.use(authorization.strategy());
app.use(passport.initialize());

// define routes
app.use('/', require('./routes'));

app.use((req, res) => {
  res.status(404).json(createErrorResponse(404, 'not found'));
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'unable to process request';

  if (status > 499) {
    logger.error({ err }, 'error processing request');
  }

  res.status(status).json({
    status: 'error',
    error: {
      code: status,
      message: message,
    },
  });
});

module.exports = app;
