const express = require("express");

const signInRouter = require("./sign-in");
const signOutRouter = require("./sign-out");
const signUpRouter = require("./sign-up");
const tokenRouter = require("./token");
const cookieRouter = require("./cookie");

const router = express.Router();

router.use("/sign-in", signInRouter);
router.use("/sign-out", signOutRouter);
router.use("/sign-up", signUpRouter);
router.use("/token", tokenRouter);
router.use("/cookie", cookieRouter);

module.exports = router;
