// tests/unit/put.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('PUT /v1/fragments', () => {
  describe('plain PUT testing', () => {
    test('expect deny on unauthenticated request', () =>
      request(app).put('/v1/fragments/doesnotexist').expect(401));

    test('expect deny on incorrect credentials', () =>
      request(app)
        .put('/v1/fragments/doesnotexist')
        .auth('invalid@email.com', 'incorrect_password')
        .expect(401));

    test('expect 404 on putting to non-existent fragment', () =>
      request(app)
        .put('/v1/fragments/doesnotexist')
        .auth('user1@email.com', 'password1')
        .send('test')
        .expect(404));

    test('expect fragment update on put request', async () => {
      const data = Buffer.from('hello');
      const data2 = Buffer.from('hello2');

      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send(data);

      await request(app)
        .put('/v1/fragments/' + res.body.fragment.id)
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send(data2)
        .expect(200);

      const returnedData = await request(app)
        .get('/v1/fragments/' + res.body.fragment.id)
        .auth('user1@email.com', 'password1');
      expect(returnedData.statusCode).toBe(200);
      expect(returnedData.text).toEqual('hello2');
      expect(returnedData.type).toEqual('text/plain');
    });

    test('expect 400 on malformed request', async () => {
      const data = Buffer.from('hello');
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send(data);

      const data2 = Buffer.from('hello2');

      const fragment = await request(app)
        .put('/v1/fragments/' + res.body.fragment.id)
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/markdown')
        .send(data2);

      expect(fragment.statusCode).toBe(400);
    });
  });
});
