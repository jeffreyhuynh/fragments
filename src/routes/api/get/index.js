// src/routes/api/get/index.js

const { createSuccessResponse } = require('../../../response');
const logger = require('../../../logger');
const { Fragment } = require('../../../model/fragment');

module.exports = async (req, res) => {
  const userFrags = await Fragment.byUser(req.user, req.query.expand === '1' ? true : false);
  logger.info(
    { user: req.user, expand: req.query.expand, fragments: userFrags },
    'GET /v1/fragments received'
  );
  res.status(200).json(createSuccessResponse({ fragments: userFrags }));
};
