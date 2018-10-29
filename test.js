const { CompositeKeySet, extractPrimaryColumns, countDuplicates } = require('./index');

describe('CompositeKeySet', () => {
  test('empty set', () => {
    let keys = ["aaa", "bbb"];
    let set = new CompositeKeySet(keys);
    let missingRow = { test: "test" };

    expect(set.has(missingRow)).toBe(false);
    expect(set.size()).toBe(0);
  })

  test('1 item', () => {
    let keys = ["aaa", "bbb"];
    let set = new CompositeKeySet(keys);
    let row = { aaa: "test", bbb: "test" };

    set.add(row);

    expect(set.has(row)).toBe(true);
    expect(set.size()).toBe(1);
  })

  test('add item that already exists with identical object references', () => {
    let keys = ["aaa", "bbb"];
    let set = new CompositeKeySet(keys);
    let row = { aaa: "test", bbb: "test" };

    set.add(row);

    expect(set.has(row)).toBe(true);
    expect(set.size()).toBe(1);

    set.add(row);

    expect(set.has(row)).toBe(true);
    expect(set.size()).toBe(1);
  });

  test('add item that already exists with different object references', () => {
    let keys = ["aaa", "bbb"];
    let set = new CompositeKeySet(keys);
    let row = { aaa: "test", bbb: "test" };
    let rowClone = { aaa: "test", bbb: "test" };

    set.add(row);

    expect(set.has(rowClone)).toBe(true);
    expect(set.size()).toBe(1);
  });

  test('multiple items', () => {
    let keys = ["aaa", "bbb"];
    let set = new CompositeKeySet(keys);
    let row1 = { aaa: "test", bbb: "test" };
    let row2 = { aaa: "test1", bbb: "test1" };

    set.add(row1);
    set.add(row2);

    expect(set.has(row1)).toBe(true);
    expect(set.has(row2)).toBe(true);
    expect(set.size()).toBe(2);
  });

  test('item without key', () => {
    let keys = ["aaa", "bbb"];
    let set = new CompositeKeySet(keys);
    let row = { foo: "test", bar: "test" };

    expect(() => set.add(row)).toThrow();
  });

  test('numeric keys', () => {
    let keys = [1, 2];
    let set = new CompositeKeySet(keys);
    let row = { 1: "test", 2: "test" };

    set.add(row);
    expect(set.size()).toBe(1);
  })

  test('alphanumeric keys', () => {
    let keys = ["1foo", "2bar"];
    let set = new CompositeKeySet(keys);
    let row = { "1foo": "test", "2bar": "test" };

    set.add(row);
    expect(set.size()).toBe(1);
  })

  test('special characters in keys', () => {
    let keys = ["%%%", "$$$"];
    let set = new CompositeKeySet(keys);
    let row = { "%%%": "test", "$$$": "test" };

    set.add(row);
    expect(set.size()).toBe(1);
  })

  test('keys not in order', () => {
    let keys = ["bar", "foo"];
    let set = new CompositeKeySet(keys);
    let row = { "foo": "test", "bar": "test" };
    let rowClone = { "bar": "test", "foo": "test" };

    set.add(row);
    expect(set.size()).toBe(1);
    expect(set.has(rowClone)).toBe(true);
  })

})

describe('extractPrimaryColumns', () => {
  test('should return an array of records containing only values in primary key columns', () => {
    let records = [
      { aaa: "testA1", bbb: "testB1" },
      { aaa: "testA2", bbb: "testB2", ccc: "testC2" },
      { aaa: "testA2" },
      {}
    ]
    let primaryKeys = ["aaa", "bbb"];

    let cols = extractPrimaryColumns(records, primaryKeys);

    expect(cols).toEqual([
      { aaa: "testA1", bbb: "testB1" },
      { aaa: "testA2", bbb: "testB2" },
      { aaa: "testA2" },
      {}
    ])
  })
})

describe('countDuplicates', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  })

  afterAll(() => {
    jest.restoreAllMocks();
  })

  test('should count zero duplicates given an empty list of records', () => {
    let rows = []
    let primaryKeys = ["aaa", "bbb"];

    let count = countDuplicates(rows, primaryKeys);

    expect(count).toEqual(0);
  })

  test('should count zero duplicates given a list with a single record', () => {
    let rows = [{ aaa: "testA1", bbb: "testB1" }]
    let primaryKeys = ["aaa", "bbb"];

    let count = countDuplicates(rows, primaryKeys);

    expect(count).toEqual(0);
  })

  test('should count the number of duplicates given a list with multiple records', () => {
    jest.spyOn(console, "log");

    let rows = [
      { aaa: "testA1", bbb: "testB1" },
      { aaa: "testA2", bbb: "testB2" },
      { aaa: "testA1", bbb: "testB1" }
    ]
    let primaryKeys = ["aaa", "bbb"];

    let count = countDuplicates(rows, primaryKeys);

    expect(count).toEqual(1);
    expect(console.log).toHaveBeenCalledWith("duplicate    aaa: testA1      bbb: testB1");
  })

  test('should count the number of duplicates given a list with multiple records', () => {
    jest.spyOn(console, "log");

    let rows = [
      { aaa: "testA1", bbb: "testB1" },
      { aaa: "testA2", bbb: "testB2" },
      { aaa: "testA1", bbb: "testB1" },
      { aaa: "testA2", bbb: "testB2" },
      { aaa: "testA1", bbb: "testB1" }
    ]
    let primaryKeys = ["aaa", "bbb"];

    let count = countDuplicates(rows, primaryKeys);

    expect(count).toEqual(3);
    expect(console.log).toHaveBeenNthCalledWith(1, "duplicate    aaa: testA1      bbb: testB1");
    expect(console.log).toHaveBeenNthCalledWith(2, "duplicate    aaa: testA2      bbb: testB2");
    expect(console.log).toHaveBeenNthCalledWith(3, "duplicate    aaa: testA1      bbb: testB1");
  })
})