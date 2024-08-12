require("dotenv").config();
require("./database/connection");

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const logger = require("morgan");

const indexRouter = require("./routes/index");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  cors({
    origin: `http://localhost:${process.env.PORT}}`,
    methods: "GET, POST",
    credential: true,
    preflightContinue: true,
  }),
);

app.use("/", indexRouter);

module.exports = app;
