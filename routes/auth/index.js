const express = require("express");

const signInRouter = require("./sign-in");
const signOutRouter = require("./sign-out");
const signUpRouter = require("./sign-up");
const refreshRouter = require("./refresh");

const router = express.Router();

router.use("/sign-in", signInRouter);
router.use("/sign-out", signOutRouter);
router.use("/sign-up", signUpRouter);
router.use("/refresh", refreshRouter);

module.exports = router;
