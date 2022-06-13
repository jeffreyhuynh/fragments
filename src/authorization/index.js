// src/authorization/index.js

if (process.env.AWS_COGNITO_POOL_ID && process.env.AWS_COGNITO_CLIENT_ID) {
  // prefer Amazon Cognito
  module.exports = require('./cognito');
} else if (process.env.HTPASSWD_FILE && process.NODE_ENV !== 'production') {
  // local testing
  module.exports = require('./basic-auth');
} else {
  throw new Error('missing env vars: no authorization configuration found');
}
