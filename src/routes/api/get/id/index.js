// src/routes/api/get/id/index.js

const logger = require('../../../../logger');
const { createErrorResponse } = require('../../../../response');
const { Fragment } = require('../../../../model/fragment');

module.exports = async (req, res) => {
  try {
    var fragment = await Fragment.byId(req.user, req.params['id']);
    let data = await fragment.getData();

    // according to specification, should return raw data in response
    res.status(200).set({ 'Content-Type': fragment.mimeType }).send(data);

    // must be expanded to include 415 for invalid .ext or type later
  } catch (err) {
    res.status(404).json(createErrorResponse(404, 'fragment does not exist'));
    logger.warn(
      { fragment, errorMessage: err.message },
      'request to non-existent fragment was made'
    );
  }
};
