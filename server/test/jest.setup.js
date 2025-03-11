const mongoose = require("mongoose");

jest.setTimeout(30000); // Set timeout globally instead of in each file

// Global afterAll to ensure connections are closed
afterAll(async () => {
  try {
    if (require('../services/s3Service').redis) {
      await require('../services/s3Service').redis.quit();
    }
    if (mongoose.connection.readyState !== 0) { // 0 = disconnected
      await mongoose.connection.close();
      console.log("MongoDB connection closed");
    }
  } catch (error) {
    console.error("Error closing connections:", error);
  }
});