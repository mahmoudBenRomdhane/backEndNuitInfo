export {};
import { NextFunction, Response, Request } from "express";
import { User, Confirmation } from "../models";
const { sendEmail } = require("../services/mailing");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const DeviceDetector = require("node-device-detector");
const jwt = require("jsonwebtoken");
const { tokenKey } = require("../config/vars");

exports.register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, firstName, lastName, gender, password, securityQuestion } =
      req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      firstName,
      lastName,
      email: email,
      password: hashedPassword,
      gender,
      role: "user",
      emailVerified: false,
      enableTwoFactor: false,
      securityQuestion: securityQuestion,
    });
    const createdUser = await user.save();
    const ConfirmationCode: string = (
      Math.floor(Math.random() * 900000) + 100000
    ).toString();
    console.log("ConfirmationCode", ConfirmationCode);
    const hashedConfirmationCode = await bcrypt.hash(ConfirmationCode, 12);
    const uuid = uuidv4();
    new Confirmation({
      user: createdUser._id,
      ConfirmationCode: hashedConfirmationCode,
      uuid: uuid,
    }).save();
    await sendEmail(email, ConfirmationCode);
    res
      .status(200)
      .json({ message: "User registered successfully", token: uuid });
  } catch (err) {
    res.status(404).json({ message: err });
  }
};

exports.checkConfirmationCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmationCode, uuid } = req.body;
    const confirmation = await Confirmation.findOne({
      uuid: uuid,
    });
    if (confirmation) {
      const createdAtPlus10Minutes = new Date(confirmation.createdAt);
      createdAtPlus10Minutes.setMinutes(
        createdAtPlus10Minutes.getMinutes() + 10
      );
      const currentDate = new Date();
      if (currentDate < createdAtPlus10Minutes) {
        const isMatch = await bcrypt.compare(
          confirmationCode,
          confirmation.ConfirmationCode
        );
        if (!isMatch) return res.status(403).json({ message: "Invalid" });
        res.cookie("test", "test", { maxAge: 3600000 });

        const isPrivateMode = !req.cookies.test; // private wela postman
        if (isPrivateMode) {
          await User.findByIdAndUpdate(
            confirmation.user,
            {
              emailVerified: true,
            },
            { new: true }
          );
        } else {
          const detector = new DeviceDetector();
          const clientInfo = detector.detect(req.headers["user-agent"]);
          const clientAddress =
            req.headers["x-forwarded-for"] || req.socket.remoteAddress;
          await User.findByIdAndUpdate(
            confirmation.user,
            {
              emailVerified: true,
              $push: {
                devices: {
                  os: `${clientInfo.os.name}_${clientInfo.os.version}_${clientInfo.os.platform}`,
                  browser: clientInfo.client.name,
                  ipAddress: clientAddress,
                  verified: true,
                },
              },
            },
            { new: true }
          );
        }
        await Confirmation.findByIdAndDelete(confirmation._id);
        return res.status(201).json({ message: "email verified" });
      } else {
        await Confirmation.findByIdAndDelete(confirmation._id);
        return res.status(200).json({ message: "expired code" });
      }
    } else {
      return res.status(400).json({ message: "not found" });
    }
  } catch (err) {
    console.log("eded", err);

    res.status(404).json({ message: "error" });
  }
};

exports.SendVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const _user = await User.findOne({
      email: email,
    });
    const detector = new DeviceDetector();
    const clientInfo = detector.detect(req.headers["user-agent"]);
    const clientAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    if (_user) {
      if (_user.emailVerified === true)
        return res.status(404).json({
          message: "user already verified",
        });
      const ConfirmationCode: string = (
        Math.floor(Math.random() * 900000) + 100000
      ).toString();
      const hashedConfirmationCode = await bcrypt.hash(ConfirmationCode, 12);
      const uuid = uuidv4();
      new Confirmation({
        user: _user._id,
        ConfirmationCode: hashedConfirmationCode,
        uuid: uuid,
      }).save();
      await sendEmail(email, ConfirmationCode);
      res.status(200).json({ message: "sended", uuid: uuid });
    } else {
      res.status(404).json({
        message: "not found",
      });
    }
  } catch (err) {
    res.status(404).json({ message: "error" });
  }
};
exports.login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const { securityQuestion } = req.body;
    const _user = await User.findOne({ email: email });
    const detector = new DeviceDetector();
    const clientInfo = detector.detect(req.headers["user-agent"]);
    const clientAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    if (!_user) return res.status(403).json({ message: "wrong credentials" });
    if (_user.emailVerified === false)
      return res.status(404).json({ message: "please activate your email" });
    const isMatch = await bcrypt.compare(password, _user.password);
    if (!isMatch) return res.status(403).json({ message: "wrong credentials" });
    res.cookie("test", "test", { maxAge: 3600000 });
    const isPrivateMode = !req.cookies.test;

    if (isPrivateMode && !securityQuestion)
      return res.status(205).json({
        status: "success",
        message: "New device detected. Additional verification required.",
        question: _user.securityQuestion.question,
      });

    const matchingDevice = _user.devices.find((device: any) => {
      return (
        device.os ===
          `${clientInfo.os.name}_${clientInfo.os.version}_${clientInfo.os.platform}` &&
        device.browser === clientInfo.client.name &&
        device.ipAddress === clientAddress
      );
    });
    if (matchingDevice) {
      const token = jwt.sign(
        {
          email: _user.email,
        },
        tokenKey,
        { expiresIn: "365d" }
      );
      res.status(200).json({
        message: "sucess",
        token: token,
      });
    } else if (securityQuestion) {
      const token = jwt.sign(
        {
          email: _user.email,
        },
        tokenKey,
        { expiresIn: "365d" }
      );
      res.status(200).json({
        message: "sucess",
        token: token,
      });
    } else {
      res.status(201).json({
        status: "success",
        message: "New device detected. Additional verification required.",
        question: _user.securityQuestion.question,
      });
    }
  } catch (err) {
    console.log("aaaaaa", err);
    res.status(404).json({ message: "error" });
  }
};
// exports.addDevice = async (req: Request, res: Response, next: NextFunction) => {
//   const { deviceId, response } = req.body;
//   try {
//     const user = await User.findOne({ "devices.deviceId": deviceId });
//     if (!user)
//       return res.status(404).json({
//         message: "device not found",
//       });
//     const deviceIndex = user.devices.findIndex(
//       (device: any) => device.deviceId === deviceId
//     );
//     const clientAddress =
//       req.headers["x-forwarded-for"] || req.socket.remoteAddress;
//     if (user.devices[deviceIndex].deviceId !== clientAddress) return;
//     return res.status(403).json({
//       message: "unauthorized",
//     });
//   } catch (err) {}
// };
exports.test = async (req: Request, res: Response, next: NextFunction) => {
  const detector = new DeviceDetector();
  res.cookie("test", "test", { maxAge: 3600000 });

  const isPrivateMode = !req.cookies.test;
  if (isPrivateMode)
    return res.status(200).json({
      isPrivateMode: isPrivateMode,
    });

  const clientInfo = detector.detect(req.headers["user-agent"]);
  const clientAddress =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  res.status(200).json({
    os: `${clientInfo.os.name} ${clientInfo.os.version} ${clientInfo.os.platform}`,
    browser: clientInfo.client.name,
    ipAddress: clientAddress,
  });
};
