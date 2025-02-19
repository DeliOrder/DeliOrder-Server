import express, { Router } from "express";

import signInRouter from "./sign-in";
import signOutRouter from "./sign-out";
import signUpRouter from "./sign-up";
import tokenRouter from "./token";
import cookieRouter from "./cookie";

const router: Router = express.Router();

router.use("/sign-in", signInRouter);
router.use("/sign-out", signOutRouter);
router.use("/sign-up", signUpRouter);
router.use("/token", tokenRouter);
router.use("/cookie", cookieRouter);

export default router;
