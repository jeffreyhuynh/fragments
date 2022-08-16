// src/routes/api/put/id.js

const logger = require('../../../logger');
const { Fragment } = require('../../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../../response');

require('dotenv').config();

module.exports = async (req, res) => {
  try {
    var fragment = await Fragment.byId(req.user, req.params['id']);
    if (req.headers['content-type'] === fragment.type) {
      await fragment.setData(req.body);
      await fragment.save();
      res
        .status(200)
        .location(process.env.API_URL + '/v1/fragments/' + fragment.id)
        .json(createSuccessResponse({ fragment: fragment }));
    } else {
      res
        .status(400)
        .json(createErrorResponse(400, `request content-type does not match fragment`));
      logger.warn({ fragment }, 'malformed PUT request made to fragment');
    }
  } catch (err) {
    res.status(404).json(createErrorResponse(404, 'fragment does not exist'));
    logger.warn(
      { fragment, errorMessage: err.message },
      'request to non-existent fragment was made'
    );
  }
};
