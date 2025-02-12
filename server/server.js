const app = express();
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const express = require("express");
const mongoose = require("mongoose");
const config = require("./config.js");
const userRouter = require("./routes/userRouter");
const authRouter = require("./routes/authRouter");

const FRONTEND_URL = "http://localhost:5173"
const port = process.env.PORT || config.port;

const corsOptions = {
  origin: FRONTEND_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

// Middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(helmet());
app.use(cors(corsOptions));

const connectDb = async () => {
  try {
    await mongoose.connect(config.mongoUri, {});
    console.log("Connected to db");
  } catch (error) {
    console.log("Error connecting to db", error);
    process.exit(1);
  }
};

const startServer = async () => {
  try {
    await connectDb();
    app.use("/api/users", userRouter);
    app.use("/api/auth", authRouter);
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.log("Error starting server", error);
    process.exit(1);
  }
};

startServer();
