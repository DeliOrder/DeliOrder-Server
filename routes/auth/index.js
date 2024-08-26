const express = require("express");

const signInRouter = require("./sign-in");
const signOutRouter = require("./sign-out");
const signUpRouter = require("./sign-up");
const refreshRouter = require("./refresh");
const tokenRouter = require("./token");

const router = express.Router();

router.use("/sign-in", signInRouter);
router.use("/sign-out", signOutRouter);
router.use("/sign-up", signUpRouter);
router.use("/refresh", refreshRouter);
router.use("/token", tokenRouter);

module.exports = router;
