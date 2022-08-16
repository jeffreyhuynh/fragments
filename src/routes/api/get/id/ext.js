// src/routes/api/get/id/ext.js

const logger = require('../../../../logger');
const { createErrorResponse } = require('../../../../response');
const { Fragment } = require('../../../../model/fragment');
const md = require('markdown-it')();
const sharp = require('sharp');

module.exports = async (req, res) => {
  try {
    var fragment = await Fragment.byId(req.user, req.params['id']);
    let data = await fragment.getData();
    // is .html
    if (req.params['ext'] === 'txt') {
      if (
        fragment.type === 'text/plain' ||
        fragment.type === 'text/markdown' ||
        fragment.type === 'text/html' ||
        fragment.type === 'application/json'
      ) {
        res.status(200).setHeader('content-type', Buffer.from('text/plain')).send(data);
      } else {
        res.status(415).json(createErrorResponse(415, 'unsupported fragment conversion type'));
      }
    } else if (req.params['ext'] === 'json') {
      if (fragment.type === 'application/json') {
        res.status(200).setHeader('content-type', Buffer.from('application/json')).send(data);
      } else {
        res.status(415).json(createErrorResponse(415, 'unsupported fragment conversion type'));
      }
    } else if (req.params['ext'] === 'md') {
      if (fragment.type === 'text/markdown') {
        res.status(200).setHeader('content-type', Buffer.from('text/markdown')).send(data);
      } else {
        res.status(415).json(createErrorResponse(415, 'unsupported fragment conversion type'));
      }
    } else if (req.params['ext'] === 'html') {
      switch (fragment.type) {
        case 'text/markdown':
          data = md.render(data.toString());
        // eslint-disable-next-line no-fallthrough
        case 'text/html':
          res.status(200).setHeader('content-type', Buffer.from('text/html')).send(data);
          break;
        default:
          res.status(415).json(createErrorResponse(415, 'unsupported fragment conversion type'));
      }
    } else if (req.params['ext'] === 'png') {
      if (
        fragment.type === 'image/png' ||
        fragment.type === 'image/jpeg' ||
        fragment.type === 'image/webp' ||
        fragment.type === 'image/gif'
      ) {
        const converted = await sharp(Buffer.from(data)).toFormat('png').toBuffer();
        res.status(200).setHeader('content-type', Buffer.from('image/png')).send(converted);
      } else {
        res.status(415).json(createErrorResponse(415, 'unsupported fragment conversion type'));
      }
    } else if (req.params['ext'] === 'jpg') {
      if (
        fragment.type === 'image/png' ||
        fragment.type === 'image/jpeg' ||
        fragment.type === 'image/webp' ||
        fragment.type === 'image/gif'
      ) {
        const converted = await sharp(Buffer.from(data)).toFormat('jpg').toBuffer();
        res.status(200).setHeader('content-type', Buffer.from('image/jpeg')).send(converted);
      } else {
        res.status(415).json(createErrorResponse(415, 'unsupported fragment conversion type'));
      }
    } else if (req.params['ext'] === 'webp') {
      if (
        fragment.type === 'image/png' ||
        fragment.type === 'image/jpeg' ||
        fragment.type === 'image/webp' ||
        fragment.type === 'image/gif'
      ) {
        const converted = await sharp(Buffer.from(data)).toFormat('webp').toBuffer();
        res.status(200).setHeader('content-type', Buffer.from('image/webp')).send(converted);
      } else {
        res.status(415).json(createErrorResponse(415, 'unsupported fragment conversion type'));
      }
    } else if (req.params['ext'] === 'gif') {
      if (
        fragment.type === 'image/png' ||
        fragment.type === 'image/jpeg' ||
        fragment.type === 'image/webp' ||
        fragment.type === 'image/gif'
      ) {
        const converted = await sharp(Buffer.from(data)).toFormat('gif').toBuffer();
        res.status(200).setHeader('content-type', Buffer.from('image/gif')).send(converted);
      } else {
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
