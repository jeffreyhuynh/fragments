// tests/unit/app.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('HTTP 404 check', () => {
  test('expect 404 on non-existent route', () => request(app).get('/abcd').expect(404));
});
