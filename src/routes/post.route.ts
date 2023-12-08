export {};
const express = require("express");
const controller = require("../controllers/post.controller");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

router.route("").post(verifyToken, controller.createPost);
router.route("").get(verifyToken, controller.list);
router.route("/reactions").get(verifyToken, controller.getReactedPostByUser);

module.exports = router;
