const express = require("express")
const http = require('http');
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();
const {corsOptions, rootRouter} = require("./config/config.js");
const {unknownEndpoint, errorHandler} = require("./middleware/errorHandler.js");
const port = process.env.PORT || 3000;
const connectDb = require("./config/db");
const initializeSocket = require('./config/socket');
const {authLimiter, apiLimiter} = require('./middleware/rateLimiter');
const userRouter = require("./routes/userRouter");
const authRouter = require("./routes/authRouter");
const groupRouter = require("./routes/groupRouter");
const fileRouter = require("./routes/fileRouter");
app.set('trust proxy', 1);

// Middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(helmet());
app.use(cors(corsOptions));

// Initialize Socket.IO with the server
const server = http.createServer(app);
const io = initializeSocket(server);
app.set('io', io);

// Apply rate limiters
app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

// Routes
app.use('/', rootRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/groups", groupRouter);
app.use("/api/files", fileRouter);
app.use(unknownEndpoint)
app.use(errorHandler)


const startServer = async () => {
  try {
    await connectDb();
    server.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.log("Error starting server", error);
    process.exit(1);
  }
};

startServer();