// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments', () => {
  describe('plain GET testing', () => {
    test('expect deny on unauthenticated request', () =>
      request(app).get('/v1/fragments').expect(401));

    test('expect deny on incorrect credentials', () =>
      request(app)
        .get('/v1/fragments')
        .auth('invalid@email.com', 'incorrect_password')
        .expect(401));

    test('expect fragments array on successful user authentication', async () => {
      const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(Array.isArray(res.body.fragments)).toBe(true);
    });
  });

  describe('GET/:id testing', () => {
    test('unauthenticated request on GET/:id returns 401', async () => {
      const data = Buffer.from('hello');
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send(data);
      const fragment = await request(app).get('/v1/fragments/' + res.body.fragment.id);
      expect(fragment.statusCode).toBe(401);
    });

    test('authenticated request on GET/:id with unknown fragment returns 404', async () => {
      const data = Buffer.from('hello');
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send(data);
      const fragment = await request(app)
        .get('/v1/fragments/' + 'aaaaa')
        .auth('user1@email.com', 'password1');
      expect(fragment.statusCode).toBe(404);
    });

    test('authenticated request on GET/:id with existing text/plain fragment returns text', async () => {
      const data = Buffer.from('hello');
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send(data);
      const returnedData = await request(app)
        .get('/v1/fragments/' + res.body.fragment.id)
        .auth('user1@email.com', 'password1');
      expect(returnedData.statusCode).toBe(200);
      expect(returnedData.text).toEqual('hello');
      expect(returnedData.type).toEqual('text/plain');
    });
  });
});
