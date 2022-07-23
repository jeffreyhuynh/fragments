// src/routes/api/delete/id.js

const logger = require('../../../logger');
const { createErrorResponse } = require('../../../response');
const { Fragment } = require('../../../model/fragment');

module.exports = async (req, res) => {
  try {
    await Fragment.delete(req.user, req.params['id']);
    res.status(200).json({ status: 'ok' });
  } catch (err) {
    res.status(404).json(createErrorResponse(404, 'fragment does not exist'));
    logger.warn({ errorMessage: err.message }, 'request to non-existent fragment was made');
  }
};

//
