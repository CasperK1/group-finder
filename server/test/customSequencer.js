const Sequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends Sequencer {
  sort(tests) {
    // Return tests sorted by their path
    // This ensures auth.test.js runs before group.test.js
    return [...tests].sort((testA, testB) => {
      // First run auth tests, then group tests
      if (testA.path.includes('auth.test.js')) return -1;
      if (testB.path.includes('auth.test.js')) return 1;
      return testA.path.localeCompare(testB.path);
    });
  }
}

module.exports = CustomSequencer;