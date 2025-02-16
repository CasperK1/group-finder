## 1. Issue:
- Updating nested objects wasn't as straightforward as just using `findByIdAndUpdate` with the updates object:
```javascript
await User.findByIdAndUpdate(userId, {
  profile: { bio: "New bio" }
});
````
The above code would replace the entire `profile` object with a new one, losing any existing data.


## 2. Solution:
- To update nested objects, we need to merge the existing object with the new object:
```javascript
const existingUser = await User.findById(req.user.id);

if (updates.profile) {
  updates.profile = {
    ...existingUser.profile.toObject(),  // Spread all existing profile fields
    ...updates.profile,                  // Spread new/updated profile fields
  };
}
```

## 3. Why ``.toObject()``?:

- The .toObject() call is necessary because Mongoose documents contain additional internal properties and methods.
Converting to a plain JavaScript object ensures clean merging of the properties.
Without it, you might get unexpected behavior when spreading the properties.

## 4. Conclusion:

- I wasn't yet aware of MongodDB's ``$set`` operator, which can be used to update nested objects in a single query. 
This would apparently be more efficient approach.
- Overall this has been a good learning experience to MERN stack and backend development in general.
