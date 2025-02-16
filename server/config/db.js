require('dotenv').config();
const mongoose = require('mongoose');
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {});

    // Basic Connection Info
    console.log('\n=== Database Connection Info ===');
    console.log('Database name:', mongoose.connection.name);
    console.log('Database host:', mongoose.connection.host);
    console.log('Database port:', mongoose.connection.port);
    console.log('Connection state:', mongoose.STATES[mongoose.connection.readyState]);

    // Database Statistics
    const dbStats = await mongoose.connection.db.stats();
    console.log('\n=== Database Statistics ===');
    console.log('Collections:', dbStats.collections);
    console.log('Total documents:', dbStats.objects);
    console.log('Storage size:', (dbStats.storageSize / 1024 / 1024).toFixed(2) + ' MB');

    // List Collections and Document Counts
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n=== Collections Overview ===');
    for (const collection of collections) {
      const count = await mongoose.connection.db.collection(collection.name).countDocuments();
      console.log(`${collection.name}: ${count} documents`);
    }

    // Monitor Connection Events
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

    console.log('\n=== Connection Successful ===');
    return true;

  } catch (error) {
    console.error('\n=== Connection Error ===');
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);

    if (error.code) {
      console.error('Error code:', error.code);
    }

    // Specific error handling
    switch (error.name) {
      case 'MongoServerSelectionError':
        console.error('Could not connect to any MongoDB server');
        break;
      case 'MongoNetworkError':
        console.error('Network connectivity issue detected');
        break;
      case 'MongoTimeoutError':
        console.error('Connection attempt timed out');
        break;
      default:
        console.error('Unexpected error occurred');
    }

    process.exit(1);
  }
};

module.exports = connectDb;