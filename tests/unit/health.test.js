// tests/unit/health.test.js

const request = require('supertest');

const app = require('../../src/app');

const { version, author } = require('../../package.json');

describe('/ health check', () => {
  test('expect HTTP 200 response', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });

  test('expect Cache-Control: no-cache header', async () => {
    const res = await request(app).get('/');
    expect(res.headers['cache-control']).toEqual('no-cache');
  });

  test('expect response to return status: ok', async () => {
    const res = await request(app).get('/');
    expect(res.body.status).toEqual('ok');
  });

  test('expect response to return correct version, githubUrl, author', async () => {
    const res = await request(app).get('/');
    expect(res.body.author).toEqual(author);
    expect(res.body.githubUrl.startsWith('https://github.com/')).toBe(true);
    expect(res.body.version).toEqual(version);
  });
});
