export {};
import express from "express";
const authRouter = require("../routes/auth.route");

const router = express.Router();

router.use("/auth", authRouter);

module.exports = router;
