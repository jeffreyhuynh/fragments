// src/routes/api/get/index.js

const { createSuccessResponse } = require('../../../response');

module.exports = (req, res) => {
  // to be updated to return list of fragments user has
  res.status(200).json(createSuccessResponse({ fragments: [] }));
};
