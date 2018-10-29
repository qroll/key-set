# key-set
A set-based data structure for objects with composite keys

The original use case for this project was to determine if duplicates existed in a CSV file meant to be loaded into an SQL database. For a single primary key, this can be easily computed with a Set, but composite primary keys are harder to check. Most methods on stackoverflow suggest joining keys with a unique delimiter, but I found that unreliable for certain string-based fields...

Only supports `has`, `add` and `size` for now.

## Usage:
```
let keys = ["aaa", "bbb"];
let set = new CompositeKeySet(keys);
let row1 = { aaa: "test", bbb: "test" };
let row2 = { aaa: "test1", bbb: "test1" };

set.add(row1);
set.size();    // 1
set.has(row1); // true
set.has(row2); // false
```
## Todo:
- [ ] npm package
- [ ] `delete` functionality
- [ ] sample code
- [ ] behaviour for missing properties
