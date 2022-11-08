const express = require("express");
const app = express();
const connectDB = require("../mongoDB");
const port = process.env.PORT || 5000;
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRouter = require("../routers/userRouter");
const postRouter = require("../routers/postRouter");

// Connect Database
connectDB();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use("/api/", userRouter, postRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
