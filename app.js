require("dotenv").config();
require("./database/connection");

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const logger = require("morgan");

const authRouter = require("./routes/auth");
const packagesRouter = require("./routes/packages");
const usersRouter = require("./routes/users");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_PORT,
    methods: ["GET, POST", "DELETE"],
    credentials: true,
  }),
);

app.use("/auth", authRouter);
app.use("/packages", packagesRouter);
app.use("/users", usersRouter);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;

  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);

  if (error.status === 500) {
    return res.status(500).json({
      error: "일시적인 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    });
  }

  return res.status(error.status).json({
    status: error.status,
    error: `${error.status} : 에러가 발생하였습니다.`,
  });
});

module.exports = app;
