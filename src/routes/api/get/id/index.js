// src/routes/api/get/id/index.js

const logger = require('../../../../logger');
const { createErrorResponse } = require('../../../../response');
const { Fragment } = require('../../../../model/fragment');

module.exports = async (req, res) => {
  try {
    var fragment = await Fragment.byId(req.user, req.params['id']);
    let data = await fragment.getData();
    res.status(200).setHeader('content-type', fragment.type).send(data);
  } catch (err) {
    res.status(404).json(createErrorResponse(404, 'fragment does not exist'));
    logger.warn(
      { fragment, errorMessage: err.message },
      'request to non-existent fragment was made'
    );
  }
};
