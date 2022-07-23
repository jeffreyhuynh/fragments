// src/routes/api/get/id/ext.js

const logger = require('../../../../logger');
const { createErrorResponse } = require('../../../../response');
const { Fragment } = require('../../../../model/fragment');
const md = require('markdown-it')();

module.exports = async (req, res) => {
  try {
    var fragment = await Fragment.byId(req.user, req.params['id']);
    let data = await fragment.getData();
    // is .html
    if (req.params['ext'] === 'html') {
      switch (fragment.type) {
        case 'text/markdown':
          data = md.render(data.toString());
        // eslint-disable-next-line no-fallthrough
        case 'text/html':
          res.status(200).setHeader('content-type', 'text/html').send(data);
          break;
        default:
          res.status(415).json(createErrorResponse(415, 'unsupported fragment conversion type'));
      }
    } else {
      // to be updated with other format conversions
      res.status(415).json(createErrorResponse(415, 'unsupported fragment conversion type'));
    }
  } catch (err) {
    res.status(404).json(createErrorResponse(404, 'fragment does not exist'));
    logger.warn(
      { fragment, errorMessage: err.message },
      'request to non-existent fragment was made'
    );
  }
};
