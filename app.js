require("dotenv").config();
require("./database/connection");

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const packagesRouter = require("./routes/packages");
const userRouter = require("./routes/users");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_PORT,
    methods: "GET, POST",
    credential: true,
  }),
);

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/packages", packagesRouter);
app.use("/users", userRouter);

module.exports = app;
