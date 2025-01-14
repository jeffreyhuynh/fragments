// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');
const md = require('markdown-it')();
const fs = require('fs');
const path = require('path');

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

    test('expect expanded fragments array on successful user authentication with expand=1', async () => {
      const data = Buffer.from('hello');
      await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send(data);
      const res = await request(app)
        .get('/v1/fragments?expand=1')
        .auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.fragments[0]).toHaveProperty('id');
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
        .get('/v1/fragments/' + res.body.fragment.id + 'a')
        .auth('user1@email.com', 'password1');
      expect(fragment.statusCode).toBe(404);
    });

    test('authenticated request on GET/:id.html with unknown fragment returns 404', async () => {
      const data = '<p>data</p>';
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/html')
        .send(data);
      const returnedData = await request(app)
        .get('/v1/fragments/' + res.body.fragment.id + 'a.html')
        .auth('user1@email.com', 'password1');
      expect(returnedData.statusCode).toBe(404);
    });

    test('authenticated request on GET/:id/info with unknown fragment returns 404', async () => {
      const data = Buffer.from('hello');
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send(data);
      const returnedData = await request(app)
        .get('/v1/fragments/' + res.body.fragment.id + 'a/info')
        .auth('user1@email.com', 'password1');
      expect(returnedData.statusCode).toBe(404);
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

    test('authenticated request on GET/:id with existing text/html fragment returns html', async () => {
      const data = Buffer.from('hello');
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/html')
        .send(data);
      const returnedData = await request(app)
        .get('/v1/fragments/' + res.body.fragment.id)
        .auth('user1@email.com', 'password1');
      expect(returnedData.statusCode).toBe(200);
      expect(returnedData.text).toEqual('hello');
      expect(returnedData.type).toEqual('text/html');
    });

    test('authenticated request on GET/:id with existing text/markdown fragment returns markdown', async () => {
      const data = Buffer.from('hello');
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/markdown')
        .send(data);
      const returnedData = await request(app)
        .get('/v1/fragments/' + res.body.fragment.id)
        .auth('user1@email.com', 'password1');
      expect(returnedData.statusCode).toBe(200);
      expect(returnedData.text).toEqual('hello');
      expect(returnedData.type).toEqual('text/markdown');
    });

    test('authenticated request on GET/:id with existing application/json fragment returns json', async () => {
      const data = { a: 'b', c: 'd' };
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'application/json')
        .send(data);
      const returnedData = await request(app)
        .get('/v1/fragments/' + res.body.fragment.id)
        .auth('user1@email.com', 'password1');
      returnedData.text = JSON.parse(returnedData.text);
      expect(returnedData.statusCode).toBe(200);
      expect(returnedData.type).toEqual('application/json');
      expect(returnedData.text['a']).toEqual('b');
      expect(returnedData.text['c']).toEqual('d');
    });

    test('authenticated request on GET/:id.txt with existing text/plain fragment returns txt', async () => {
      const data = 'test';
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send(data);
      const returnedData = await request(app)
        .get('/v1/fragments/' + res.body.fragment.id + '.txt')
        .auth('user1@email.com', 'password1');
      expect(returnedData.statusCode).toBe(200);
      expect(returnedData.type).toEqual('text/plain');
      expect(returnedData.text).toEqual(data);
    });

    test('authenticated request on GET/:id.md with existing text/markdown fragment returns md', async () => {
      const data = '# test';
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/markdown')
        .send(data);
      const returnedData = await request(app)
        .get('/v1/fragments/' + res.body.fragment.id + '.md')
        .auth('user1@email.com', 'password1');
      expect(returnedData.statusCode).toBe(200);
      expect(returnedData.type).toEqual('text/markdown');
      expect(returnedData.text).toEqual(data);
    });

    test('authenticated request on GET/:id.json with existing application/json fragment returns json', async () => {
      const data = { a: 1, b: 2 };
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'application/json')
        .send(data);
      const returnedData = await request(app)
        .get('/v1/fragments/' + res.body.fragment.id + '.json')
        .auth('user1@email.com', 'password1');
      expect(returnedData.statusCode).toBe(200);
      expect(returnedData.type).toEqual('application/json');
      expect(JSON.parse(returnedData.text)).toEqual(data);
    });

    test('authenticated request on GET/:id.html with existing text/html fragment returns html', async () => {
      const data = '<p>data</p>';
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/html')
        .send(data);
      const returnedData = await request(app)
        .get('/v1/fragments/' + res.body.fragment.id + '.html')
        .auth('user1@email.com', 'password1');
      expect(returnedData.statusCode).toBe(200);
      expect(returnedData.type).toEqual('text/html');
      expect(returnedData.text).toEqual(data);
    });

    test('authenticated request on GET/:id.html with existing text/markdown fragment returns html', async () => {
      const data = '# test';
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/markdown')
        .send(data);
      const returnedData = await request(app)
        .get('/v1/fragments/' + res.body.fragment.id + '.html')
        .auth('user1@email.com', 'password1');
      expect(returnedData.statusCode).toBe(200);
      expect(returnedData.type).toEqual('text/html');
      expect(returnedData.text).toEqual(md.render(data));
    });

    test('authenticated request on GET/:id.ext with png input should return correct content-types', async () => {
      const img = fs.readFileSync(path.resolve(__dirname, '../../assets/potato.png'));
      const data = Buffer.from(img);
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'image/png')
        .send(data);
      expect(res.body).toHaveProperty('fragment');
      expect(res.body.fragment.type).toEqual('image/png');

      const returnedData = await request(app)
        .get('/v1/fragments/' + res.body.fragment.id + '.jpg')
        .auth('user1@email.com', 'password1');
      expect(returnedData.statusCode).toBe(200);
      expect(returnedData.type).toEqual('image/jpeg');

      const returnedData2 = await request(app)
        .get('/v1/fragments/' + res.body.fragment.id + '.webp')
        .auth('user1@email.com', 'password1');
      expect(returnedData2.statusCode).toBe(200);
      expect(returnedData2.type).toEqual('image/webp');

      const returnedData3 = await request(app)
        .get('/v1/fragments/' + res.body.fragment.id + '.gif')
        .auth('user1@email.com', 'password1');
      expect(returnedData3.statusCode).toBe(200);
      expect(returnedData3.type).toEqual('image/gif');
    });

    test('authenticated request on GET/:id.ext with jpg input should return correct content-types', async () => {
      const img = fs.readFileSync(path.resolve(__dirname, '../../assets/potato.jpg'));
      const data = Buffer.from(img);
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'image/jpeg')
        .send(data);
      expect(res.body).toHaveProperty('fragment');
      expect(res.body.fragment.type).toEqual('image/jpeg');

      const returnedData = await request(app)
        .get('/v1/fragments/' + res.body.fragment.id + '.png')
        .auth('user1@email.com', 'password1');
      expect(returnedData.statusCode).toBe(200);
      expect(returnedData.type).toEqual('image/png');

      const returnedData2 = await request(app)
        .get('/v1/fragments/' + res.body.fragment.id + '.webp')
        .auth('user1@email.com', 'password1');
      expect(returnedData2.statusCode).toBe(200);
      expect(returnedData2.type).toEqual('image/webp');

      const returnedData3 = await request(app)
        .get('/v1/fragments/' + res.body.fragment.id + '.gif')
        .auth('user1@email.com', 'password1');
      expect(returnedData3.statusCode).toBe(200);
      expect(returnedData3.type).toEqual('image/gif');
    });

    test('authenticated request on GET/:id.ext with webp input should return correct content-types', async () => {
      const img = fs.readFileSync(path.resolve(__dirname, '../../assets/potato.webp'));
      const data = Buffer.from(img);
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'image/webp')
        .send(data);
      expect(res.body).toHaveProperty('fragment');
      expect(res.body.fragment.type).toEqual('image/webp');

      const returnedData2 = await request(app)
        .get('/v1/fragments/' + res.body.fragment.id + '.png')
        .auth('user1@email.com', 'password1');
      expect(returnedData2.statusCode).toBe(200);
      expect(returnedData2.type).toEqual('image/png');

      const returnedData = await request(app)
        .get('/v1/fragments/' + res.body.fragment.id + '.jpg')
        .auth('user1@email.com', 'password1');
      expect(returnedData.statusCode).toBe(200);
      expect(returnedData.type).toEqual('image/jpeg');

      const returnedData3 = await request(app)
        .get('/v1/fragments/' + res.body.fragment.id + '.gif')
        .auth('user1@email.com', 'password1');
      expect(returnedData3.statusCode).toBe(200);
      expect(returnedData3.type).toEqual('image/gif');
    });

    test('authenticated request on GET/:id.ext with gif input should return correct content-types', async () => {
      const img = fs.readFileSync(path.resolve(__dirname, '../../assets/potato.gif'));
      const data = Buffer.from(img);
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'image/gif')
        .send(data);
      expect(res.body).toHaveProperty('fragment');
      expect(res.body.fragment.type).toEqual('image/gif');

      const returnedData2 = await request(app)
        .get('/v1/fragments/' + res.body.fragment.id + '.png')
        .auth('user1@email.com', 'password1');
      expect(returnedData2.statusCode).toBe(200);
      expect(returnedData2.type).toEqual('image/png');

      const returnedData = await request(app)
        .get('/v1/fragments/' + res.body.fragment.id + '.jpg')
        .auth('user1@email.com', 'password1');
      expect(returnedData.statusCode).toBe(200);
      expect(returnedData.type).toEqual('image/jpeg');

      const returnedData3 = await request(app)
        .get('/v1/fragments/' + res.body.fragment.id + '.webp')
        .auth('user1@email.com', 'password1');
      expect(returnedData3.statusCode).toBe(200);
      expect(returnedData3.type).toEqual('image/webp');
    });

    test('authenticated request on GET/:id.html with unsupported conversion on existing fragment returns 415', async () => {
      const data = '# test';
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'application/json')
        .send(data);
      const returnedData = await request(app)
        .get('/v1/fragments/' + res.body.fragment.id + '.html')
        .auth('user1@email.com', 'password1');
      expect(returnedData.statusCode).toBe(415);
    });

    test('authenticated request on GET/:id.html with unsupported conversion returns 415', async () => {
      const data = '# test';
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/markdown')
        .send(data);
      const returnedData = await request(app)
        .get('/v1/fragments/' + res.body.fragment.id + '.mp4')
        .auth('user1@email.com', 'password1');
      expect(returnedData.statusCode).toBe(415);
    });

    test('authenticated request on GET/:id.ext with image input should return 415 on text formats', async () => {
      const img = fs.readFileSync(path.resolve(__dirname, '../../assets/potato.gif'));
      const data = Buffer.from(img);
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'image/gif')
        .send(data);
      expect(res.body).toHaveProperty('fragment');
      expect(res.body.fragment.type).toEqual('image/gif');

      const returnedData = await request(app)
        .get('/v1/fragments/' + res.body.fragment.id + '.txt')
        .auth('user1@email.com', 'password1');
      expect(returnedData.statusCode).toBe(415);

      const returnedData2 = await request(app)
        .get('/v1/fragments/' + res.body.fragment.id + '.md')
        .auth('user1@email.com', 'password1');
      expect(returnedData2.statusCode).toBe(415);

      const returnedData3 = await request(app)
        .get('/v1/fragments/' + res.body.fragment.id + '.html')
        .auth('user1@email.com', 'password1');
      expect(returnedData3.statusCode).toBe(415);

      const returnedData4 = await request(app)
        .get('/v1/fragments/' + res.body.fragment.id + '.json')
        .auth('user1@email.com', 'password1');
      expect(returnedData4.statusCode).toBe(415);
    });

    test('authenticated request on GET/:id.ext with txt input should return 415 on image formats', async () => {
      const data = 'text';
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send(data);
      expect(res.body).toHaveProperty('fragment');
      expect(res.body.fragment.type).toEqual('text/plain');

      const returnedData = await request(app)
        .get('/v1/fragments/' + res.body.fragment.id + '.png')
        .auth('user1@email.com', 'password1');
      expect(returnedData.statusCode).toBe(415);

      const returnedData2 = await request(app)
        .get('/v1/fragments/' + res.body.fragment.id + '.jpg')
        .auth('user1@email.com', 'password1');
      expect(returnedData2.statusCode).toBe(415);

      const returnedData3 = await request(app)
        .get('/v1/fragments/' + res.body.fragment.id + '.webp')
        .auth('user1@email.com', 'password1');
      expect(returnedData3.statusCode).toBe(415);

      const returnedData4 = await request(app)
        .get('/v1/fragments/' + res.body.fragment.id + '.gif')
        .auth('user1@email.com', 'password1');
      expect(returnedData4.statusCode).toBe(415);
    });

    test('authenticated request on GET/:id/info with existing fragment returns metadata', async () => {
      const data = Buffer.from('hello');
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send(data);
      const returnedData = await request(app)
        .get('/v1/fragments/' + res.body.fragment.id + '/info')
        .auth('user1@email.com', 'password1');
      expect(returnedData.statusCode).toBe(200);
      expect(returnedData.text).toMatch(/{.*}/);
      expect(returnedData.type).toEqual('text/plain');
    });
  });
});
