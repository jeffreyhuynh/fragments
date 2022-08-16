// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');

const hash = require('../../src/hash');

require('dotenv').config();

describe('POST /v1/fragments', () => {
  test('should return 401 on POST without authentication', async () => {
    const data = Buffer.from('hello');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user2@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    expect(res.statusCode).toBe(401);
  });

  test('should return 201 on POST after authentication', async () => {
    const data = Buffer.from('hello');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    expect(res.statusCode).toBe(201);
  });

  test('should return 415 on POST after authentication if request is invalid', async () => {
    const data = Buffer.from('hello');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plane')
      .send(data);
    expect(res.statusCode).toBe(415);
  });

  test('successful POST should return location header', async () => {
    const data = Buffer.from('hello');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    expect(res.headers.location.startsWith(process.env.API_URL)).toBe(true);
  });

  test('successful POST should return status: ok', async () => {
    const data = Buffer.from('hello');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    expect(res.body).toHaveProperty('status', 'ok');
  });

  test('successful POST should return a fragment', async () => {
    const data = Buffer.from('hello');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    expect(res.body).toHaveProperty('fragment');
  });

  test('text/html should return proper content type', async () => {
    const data = Buffer.from('hello');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/html')
      .send(data);
    expect(res.body).toHaveProperty('fragment');
    expect(res.body.fragment.type).toEqual('text/html');
  });

  test('text/markdown should return proper content type', async () => {
    const data = Buffer.from('hello');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send(data);
    expect(res.body).toHaveProperty('fragment');
    expect(res.body.fragment.type).toEqual('text/markdown');
  });

  test('application/json should return proper content type', async () => {
    const data = { a: 'b' };
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(data);
    expect(res.body).toHaveProperty('fragment');
    expect(res.body.fragment.type).toEqual('application/json');
  });

  test('image/png should return proper content type', async () => {
    const data = Buffer.from('test');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/png')
      .send(data);
    expect(res.body).toHaveProperty('fragment');
    expect(res.body.fragment.type).toEqual('image/png');
  });

  test('image/jpeg should return proper content type', async () => {
    const data = Buffer.from('test');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/jpeg')
      .send(data);
    expect(res.body).toHaveProperty('fragment');
    expect(res.body.fragment.type).toEqual('image/jpeg');
  });

  test('image/webp should return proper content type', async () => {
    const data = Buffer.from('test');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/webp')
      .send(data);
    expect(res.body).toHaveProperty('fragment');
    expect(res.body.fragment.type).toEqual('image/webp');
  });

  test('image/gif should return proper content type', async () => {
    const data = Buffer.from('test');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/gif')
      .send(data);
    expect(res.body).toHaveProperty('fragment');
    expect(res.body.fragment.type).toEqual('image/gif');
  });

  test('successful POST should return fragment properties', async () => {
    const data = Buffer.from('hello');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    expect(res.body.fragment).toHaveProperty('ownerId');
    expect(res.body.fragment).toHaveProperty('id');
    expect(res.body.fragment).toHaveProperty('created');
    expect(res.body.fragment).toHaveProperty('updated');
    expect(res.body.fragment).toHaveProperty('type');
    expect(res.body.fragment).toHaveProperty('size');
  });

  test('successful POST should match request args', async () => {
    const data = Buffer.from('hello');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    expect(res.body.fragment).toHaveProperty('ownerId', hash('user1@email.com'));
    expect(res.body.fragment).toHaveProperty('type', 'text/plain');
    expect(res.body.fragment).toHaveProperty('size', data.length);
  });

  test('successful POST with invalid request should return an error', async () => {
    const data = Buffer.from('hello');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plane')
      .send(data);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toHaveProperty('code', 415);
    expect(res.body.error).toHaveProperty('message', 'invalid request: content type not supported');
  });
});
