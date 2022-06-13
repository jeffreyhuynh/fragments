// src/authorization/basic-auth.js

const authorize = require('./authorize-middleware');
const auth = require('http-auth');
const authPassport = require('http-auth-passport');

if (!process.env.HTPASSWD_FILE) {
  throw new Error('missing expected env var: HTPASSWD_FILE');
}

module.exports.strategy = () =>
  authPassport(
    auth.basic({
      file: process.env.HTPASSWD_FILE,
    })
  );

module.exports.authenticate = () => authorize('http');
