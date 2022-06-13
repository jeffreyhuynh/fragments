// src/routes/api/get/id.js

const { createSuccessResponse, createErrorResponse } = require('../../../response');
const { Fragment } = require('../../../model/fragment');

module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params['id']);
    const data = await fragment.getData();
    res.status(200).json(createSuccessResponse({ data: data }));
    // must be expanded to include 415 for invalid .ext or type later
  } catch (e) {
    res.status(404).json(createErrorResponse({ code: 404, message: 'fragment does not exist' }));
  }
};
