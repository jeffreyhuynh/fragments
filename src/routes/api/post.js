// src/routes/api/post.js
const contentType = require('content-type');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
require('dotenv').config();

module.exports = (req, res) => {
  // content is parsable
  if (Buffer.isBuffer(req.body) === true) {
    const fragment = new Fragment({
      ownerId: req.user,
      type: contentType.parse(req).type,
      size: req.body.length,
    });
    fragment.save();
    fragment.setData(req.body);
    res
      .status(201)
      .location(process.env.API_URL + '/v1/fragments/' + fragment.id)
      .json(createSuccessResponse({ fragment: fragment }));
  } else {
    res.status(415).json(createErrorResponse(415, 'invalid request: content type not supported'));
  }
};
