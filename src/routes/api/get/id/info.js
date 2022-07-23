// src/routes/api/get/id/info.js

const logger = require('../../../../logger');
const { createErrorResponse } = require('../../../../response');
const { Fragment } = require('../../../../model/fragment');

module.exports = async (req, res) => {
  try {
    var fragment = await Fragment.byId(req.user, req.params['id']);
    res.status(200).setHeader('content-type', Buffer.from(fragment.type)).send(fragment);
  } catch (err) {
    res.status(404).json(createErrorResponse(404, 'fragment does not exist'));
    logger.warn(
      { fragment, errorMessage: err.message },
      'request to non-existent fragment was made'
    );
  }
};
