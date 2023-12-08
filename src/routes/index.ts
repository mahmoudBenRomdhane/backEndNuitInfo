export {};
import express from "express";
import { storage } from "../config/multer";
const authRouter = require("../routes/auth.route");
const postRouter = require("../routes/post.route");
const uploadController = require("../controllers/upload.controller");

const router = express.Router();

router.post("/upload", storage, uploadController.uploadFile);
router.use("/auth", authRouter);
router.use("/post", postRouter);

module.exports = router;
