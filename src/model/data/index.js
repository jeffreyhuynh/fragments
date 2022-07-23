// src/model/data/index.js

// select database strategy
module.exports = process.env.AWS_REGION ? require('./aws') : require('./memory');
