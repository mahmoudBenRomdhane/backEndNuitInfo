export {};
const express = require("express");
const controller = require("../controllers/auth.controller");
const router = express.Router();

router.route("/register").post(controller.register);
router.route("/check-Confirmation-Code").post(controller.checkConfirmationCode);
router.route("/send-verification").post(controller.SendVerification);
router.route("/login").post(controller.login);
// router.route("/test").get(controller.test);

module.exports = router;
