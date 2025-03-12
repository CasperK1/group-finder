# Sprint2 Self-Assessment (Tino)

## Group Member Info

**Issue** Initially, getGroupInformation returned the member list as just an array of user IDs. To get the usernames etc. of all the members, it would search by ID for each user individually, which resulted in a bothersome amount of API calls.

**Solution** Now the IDs in the members array are replaced with the members' username, first name, and last name, so there is no need to make individual GET requests for each member.

```javascript
const groupObj = group.toObject();

const memberInfo = await Promise.all(
    group.members.map(memberId =>
        User.findById(memberId).select(
            "username profile.firstName profile.lastName"
        )
    )
);

groupObj.members = memberInfo;
```

**Lesson learned:** In most cases it's better to include all relevant information within one GET request to reduce additional API calls.


## Running simultaneous tests

**Issue:** Running the backend tests at once resulted in a bunch of errors, as the tests interfered with each other. In this case the issue was caused by both tests requiring a test user to log in.

**Solution:** I created a new file called customSequencer.js, which makes sure that the tests run sequentially instead of simultaneously.

```javascript
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
```

**Lesson learned:** If the backend tests use features that are generally used only by one process at a time, it's better to make the tests run sequentially to reduce interference between them.