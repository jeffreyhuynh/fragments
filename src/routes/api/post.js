// src/routes/api/post.js

const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');

require('dotenv').config();

module.exports = async (req, res) => {
  // content is parsable
  if (Buffer.isBuffer(req.body) === true) {
    var fragment = new Fragment({
      ownerId: req.user,
      type: req.headers['content-type'],
      size: req.body.length,
    });

    try {
      await fragment.setData(req.body);
      await fragment.save();
      res
        .status(201)
        .location(process.env.API_URL + '/v1/fragments/' + fragment.id)
        .json(createSuccessResponse({ fragment: fragment }));
    } catch (err) {
      res.status(500).json(createErrorResponse(500, 'fragment was unable to be saved'));
      logger.warn({ fragment, errorMessage: err.message }, 'failed to save fragment');
    }
  } else {
    res.status(415).json(createErrorResponse(415, 'invalid request: content type not supported'));
    logger.warn({ fragment }, 'request with invalid content type made');
  }
};
