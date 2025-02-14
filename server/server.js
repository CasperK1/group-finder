const express = require("express")
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();
const {corsOptions} = require("./config/config.js");
const port = process.env.PORT || 3000;
const connectDb = require("./config/db");
const { authLimiter, apiLimiter } = require('./middleware/rateLimiter');
const userRouter = require("./routes/userRouter");
const authRouter = require("./routes/authRouter");
const groupRouter = require("./routes/groupRouter");

// Basic middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(helmet());
app.use(cors(corsOptions));

// Apply rate limiters
app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

// Routes
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/groups", groupRouter);

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

const startServer = async () => {
  try {
    await connectDb();
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.log("Error starting server", error);
    process.exit(1);
  }
};

startServer();