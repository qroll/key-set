# key-set
A set-based data structure for objects with composite keys

The original use case for this project was to determine if duplicates existed in a CSV file meant to be loaded into an SQL database. For a single primary key, this can be easily computed with a Set, but composite primary keys are harder to check. Most methods on stackoverflow suggest joining keys with a unique delimiter, but I found that unreliable for certain string-based fields...

Only supports `has`, `add` and `size` for now.

## Todo:
- [ ] npm package
- [ ] `delete` functionality
- [ ] sample code
