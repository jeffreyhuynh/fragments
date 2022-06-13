// src/routes/index.js

const express = require('express');
const { authenticate } = require('../authorization');
const { version, author } = require('../../package.json');
const { createSuccessResponse } = require('../response');

const router = express.Router();
router.use(`/v1`, authenticate(), require('./api'));

router.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.status(200).json(
    createSuccessResponse({
      author: author,
      githubUrl: 'https://github.com/jeffreyhuynh/fragments',
      version: version,
    })
  );
});

module.exports = router;
