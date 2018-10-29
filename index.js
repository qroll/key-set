class CompositeKeySet {
  constructor(primaryKeys) {
    this.primaryKeys = primaryKeys;
    if (primaryKeys.length === 1) {
      this.unique = new Set();
    } else {
      this.unique = new Map();
    }
  }

  size() {
    return this._size(this.unique);
  }

  _size(list) {
    if (list instanceof Set) {
      return list.size;
    }
    if (list instanceof Map) {
      return Array.from(list.values()).reduce((acc, curr) => {
        return acc + this._size(curr);
      }, 0);
    }
  }

  add(row) {
    let currentPath = this.unique;
    this.primaryKeys.forEach((key, i) => {
      if (!(key in row)) {
        throw new Error(`Missing property ${key} in row`);
      }
      if (i === this.primaryKeys.length - 1) { // last index is a set
        currentPath.add(row[key]);
      } else {
        if (!currentPath.has(row[key])) {
          if (i === this.primaryKeys.length - 2) {
            currentPath.set(row[key], new Set());
          } else {
            currentPath.set(row[key], new Map());
          }
        }
        currentPath = currentPath.get(row[key]);
      }
    });
  }

  has(row) {
    let exists = false;
    let currentPath = this.unique;

    for (let i = 0; i < this.primaryKeys.length; i++) {
      let key = this.primaryKeys[i];
      if (i === this.primaryKeys.length - 1) {
        exists = currentPath.has(row[key]);
      } else {
        if (currentPath.has(row[key])) {
          currentPath = currentPath.get(row[key]);
        } else {
          break;
        }
      }
    }

    return exists;
  }
}

/*
utility functions
*/
const extractPrimaryColumns = (records, primaryKeys) => {
  let rows = [];
  records.forEach(record => {
    // console.log(record);
    let row = {};
    primaryKeys.forEach(key => {
      row[key] = record[key];
    })
    rows.push(row);
  });

  return rows;
}

const defaultLogMessage = (row, primaryKeys) => {
  let keyValues = primaryKeys.map(key => `${key}: ${row[key]}`);
  return "duplicate    " + keyValues.join("      ");
}

const countDuplicates = (rows, primaryKeys, options = {}) => {
  let { logMessage = defaultLogMessage, quiet = false } = options;

  let unique = new CompositeKeySet(primaryKeys);
  let count = 0;

  rows.forEach((row) => {
    if (unique.has(row)) {
      count++;
      if (!quiet) {
        console.log(logMessage(row, primaryKeys));
      }
    } else {
      unique.add(row);
    }
  });

  return count;
}

module.exports = {
  CompositeKeySet,
  extractPrimaryColumns,
  countDuplicates
}