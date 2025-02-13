const express = require("express")
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();
const {corsOptions} = require("./config.js");
const port = process.env.PORT || 3000;
const userRouter = require("./routes/userRouter");
const authRouter = require("./routes/authRouter");
const groupRouter = require("./routes/groupRouter");

// Middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(helmet());
app.use(cors(corsOptions));

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {});
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
    app.use("/api/groups", groupRouter);
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.log("Error starting server", error);
    process.exit(1);
  }
};

startServer();
