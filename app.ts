import createError from "http-errors";
import express, { Request, Response, Express, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import "dotenv/config";
import "./database/connection";

import authRouter from "./routes/auth";
import packagesRouter from "./routes/packages";
import usersRouter from "./routes/users";
import healthCheckRouter from "./routes/healthCheck";

const app: Express = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

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
app.use("/health-check", healthCheckRouter);

app.use((_: Request, __: Response, next: NextFunction) => {
  next(createError(404));
});

app.use((err: createError.HttpError, req: Request, res: Response) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

export default app;
