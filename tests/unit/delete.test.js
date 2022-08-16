// tests/unit/delete.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('DELETE /v1/fragments', () => {
  describe('plain PUT testing', () => {
    test('expect deny on unauthenticated request', () =>
      request(app).delete('/v1/fragments/doesnotexist').expect(401));

    test('expect deny on incorrect credentials', () =>
      request(app)
        .delete('/v1/fragments/doesnotexist')
        .auth('invalid@email.com', 'incorrect_password')
        .expect(401));

    test('expect 404 on deleting non-existent fragment', () =>
      request(app)
        .delete('/v1/fragments/doesnotexist')
        .auth('user1@email.com', 'password1')
        .expect(404));

    test('expect fragment removal on delete request', async () => {
      const data = Buffer.from('hello');
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send(data);

      const fragment = await request(app)
        .delete('/v1/fragments/' + res.body.fragment.id)
        .auth('user1@email.com', 'password1');

      const fragment2 = await request(app)
        .delete('/v1/fragments/' + res.body.fragment.id)
        .auth('user1@email.com', 'password1');

      expect(fragment.statusCode).toBe(200);
      expect(fragment2.statusCode).toBe(404);
    });
  });
});
