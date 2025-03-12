# Sprint 3

# Sprint 3 Self-Assessment

## 1. Issue: Performance bottleneck with S3 signed URLs

- Each time a user accessed content (profile pictures, group files), the application was generating new S3 signed URLs
- This resulted in:
  - High latency for users (each request required a new AWS API call)
  - Potential AWS throttling due to high request volume
  - Increased AWS costs from repeated requests for the same resources

```javascript
// Original approach - generating a new signed URL for every request
const signedUrl = await getSignedUrl(this.s3Client, command, {
  expiresIn: expiresIn
});
```

## 2. Solution: Redis caching for signed URLs

- Implemented Redis caching to store generated S3 signed URLs:
  - URLs are cached with keys based on file identifier and expiration time
  - Set TTL (Time To Live) slightly shorter than the actual URL expiration to prevent serving stale URLs
  - Added fault tolerance to gracefully handle Redis connection issues

```javascript
// Check redis cache
const cacheKey = `s3url:${key}:${expiresIn}`;
if (this.redisAvailable) {
  try {
    const cachedUrl = await this.redis.get(cacheKey);
    if (cachedUrl) {
      console.log('Returning cached URL');
      return cachedUrl;
    }
  } catch (err) {
    console.warn('Redis read error, bypassing cache:', err.message);
  }
}

// Generate URL only when needed
const signedUrl = await getSignedUrl(this.s3Client, command, {
  expiresIn: expiresIn
});

// Cache new URL
if (this.redisAvailable) {
  try {
    const cacheTTL = Math.floor(expiresIn * 0.95);
    await this.redis.set(cacheKey, signedUrl, 'EX', cacheTTL);
  } catch (err) {
    console.warn('Redis write error, skipping cache:', err.message);
  }
}
```

## 3. Added resilience with fallback mechanism

- The system now gracefully handles Redis connection issues:
  - Tracks Redis connection state with a `redisAvailable` flag
  - Automatically falls back to direct S3 URL generation when Redis is unavailable
  - Implements retries with exponential backoff for Redis connection
  - Provides detailed logging for connection issues

```javascript
this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  retryStrategy(times) {
    if (times > 15) {
      console.warn('Max Redis reconnection attempts reached, disabling Redis');
      return null; // Stop retrying after 15 failed attempts
    }
    return Math.min(times * 100, 3000);
  }
});

this.redis.on('connect', () => {
  console.log(`Redis connected successfully @ ${process.env.REDIS_URL}`);
  this.redisAvailable = true;
});

this.redis.on('error', (err) => {
  console.warn('Redis connection error, running without caching:', err.message);
  this.redisAvailable = false;
});
```

## 4. Benefits achieved

- **Performance improvements**:
  - Reduced latency for users accessing files and profile pictures
  - Decreased load on AWS S3 services
  - Lower AWS costs by reducing redundant API calls



# Sprint 2
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
