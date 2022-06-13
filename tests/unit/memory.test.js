const db = require('../../src/model/data/');

describe('memory db fragment testing', () => {
  test('writeFragment() returns nothing', async () => {
    expect(
      await db.writeFragment({
        ownerId: 'test',
        id: 'a',
        fragment: 'Lorem ipsum dolor sit amet',
      })
    ).toBe(undefined);
  });

  test('writeFragmentData() returns nothing', async () => {
    expect(await db.writeFragmentData('test', 'a', 'Lorem ipsum dolor sit amet')).toBe(undefined);
  });

  test('readFragment() returns fragment given existing key', async () => {
    expect(await db.readFragment('test', 'a')).toEqual({
      ownerId: 'test',
      id: 'a',
      fragment: 'Lorem ipsum dolor sit amet',
    });
  });

  test('readFragmentData() returns data given existing key', async () => {
    expect(await db.readFragmentData('test', 'a')).toEqual('Lorem ipsum dolor sit amet');
  });

  test('readFragment() returns nothing given non-existent key', async () => {
    expect(await db.readFragment('test', 'b')).toBe(undefined);
  });

  test('readFragmentData() returns nothing given non-existent key', async () => {
    expect(await db.readFragmentData('test', 'b')).toBe(undefined);
  });

  test('writeFragment() updates fragment given existing key', async () => {
    await db.writeFragment({
      ownerId: 'test',
      id: 'c',
      fragment: 'Lorem ipsum dolor sit amet',
    });
    await db.writeFragment({
      ownerId: 'test',
      id: 'c',
      fragment: 'consectetur adipiscing elit',
    });

    expect(await db.readFragment('test', 'c')).toEqual({
      ownerId: 'test',
      id: 'c',
      fragment: 'consectetur adipiscing elit',
    });
  });

  test('writeFragmentData() updates value given existing key', async () => {
    await db.writeFragmentData('test', 'c', 'Lorem ipsum dolor sit amet');
    await db.writeFragmentData('test', 'c', 'consectetur adipiscing elit');

    expect(await db.readFragmentData('test', 'c')).toEqual('consectetur adipiscing elit');
  });

  test('listFragmentData() returns nothing when owner has no keys', async () => {
    expect(await db.listFragments('test2')).toEqual([]);
  });

  test('listFragmentData() returns ids when owner has keys, expand is false', async () => {
    expect(await db.listFragments('test')).toEqual(['a', 'c']);
  });

  test('listFragmentData() returns fragments when owner has keys, expand is true', async () => {
    expect(await db.listFragments('test', true)).toEqual([
      {
        ownerId: 'test',
        id: 'a',
        fragment: 'Lorem ipsum dolor sit amet',
      },
      {
        ownerId: 'test',
        id: 'c',
        fragment: 'consectetur adipiscing elit',
      },
    ]);
  });

  test('deleteFragment() removes key from database', async () => {
    expect(await db.deleteFragment('test', 'a')).toEqual([undefined, undefined]);
    expect(await db.readFragment('test', 'a')).toBe(undefined);
    expect(await db.readFragmentData('test', 'a')).toBe(undefined);
  });

  test('writeFragment() throws on non-string keys', async () => {
    expect(async () => await db.writeFragment({})).rejects.toThrow();
    expect(
      async () =>
        await db.writeFragment({
          ownerId: 1,
        })
    ).rejects.toThrow();
    expect(
      async () =>
        await db.writeFragment({
          ownerId: 1,
          id: 1,
        })
    ).rejects.toThrow();
  });

  test('writeFragmentData() throws on non-string keys', async () => {
    expect(async () => await db.writeFragmentData()).rejects.toThrow();
    expect(async () => await db.writeFragmentData(1)).rejects.toThrow();
    expect(async () => await db.writeFragmentData(1, 1)).rejects.toThrow();
  });

  test('readFragment() throws on non-string keys', async () => {
    expect(async () => await db.readFragment()).rejects.toThrow();
    expect(async () => await db.readFragment(1)).rejects.toThrow();
    expect(async () => await db.readFragment(1, 1)).rejects.toThrow();
  });

  test('readFragmentData() throws on non-string keys', async () => {
    expect(async () => await db.readFragmentData()).rejects.toThrow();
    expect(async () => await db.readFragmentData(1)).rejects.toThrow();
    expect(async () => await db.readFragmentData(1, 1)).rejects.toThrow();
  });

  test('listFragments() throws on non-string key', async () => {
    expect(async () => await db.listFragments()).rejects.toThrow();
    expect(async () => await db.listFragments(1)).rejects.toThrow();
  });

  test('deleteFragment() throws on non-string keys', async () => {
    expect(async () => await db.deleteFragment()).rejects.toThrow();
    expect(async () => await db.deleteFragment(1)).rejects.toThrow();
    expect(async () => await db.deleteFragment(1, 1)).rejects.toThrow();
  });
});
