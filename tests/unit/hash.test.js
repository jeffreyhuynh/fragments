// tests/unit/hash.test.js

const hash = require('../../src/hash');

describe('hash()', () => {
  const email = 'user1@example.com';

  test('email addresses should get hashed using sha256 to hex strings', () => {
    const hashedEmail = 'b36a8370';
    expect(hash(email)).toEqual(hashedEmail);
  });

  test('hashing should always return the same value for a given string', () => {
    const email = 'user1@example.com';
    expect(hash(email)).toEqual(hash(email));
  });
});
