const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const app = express();
const config = require("./config.js");
const port = process.env.PORT || config.port;
const userRouter = require("./routes/userRoute");

// Middleware
app.use(express.json());
app.use(morgan("tiny"));

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
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.log("Error starting server", error);
    process.exit(1);
  }
};

startServer();
