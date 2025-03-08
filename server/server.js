require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDb = require("./config/db");
const initializeSocket = require('./config/socket');

const port = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with the server
const io = initializeSocket(server);
app.set('io', io);

const startServer = async () => {
  try {

    // Start server
    server.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
      if (process.env.NODE_ENV !== 'production') {
        console.log(`API Documentation available at http://localhost:${port}/api-documentation`);
      }
    });
  } catch (error) {
    console.log("Error starting server", error);
    process.exit(1);
  }
};

startServer();