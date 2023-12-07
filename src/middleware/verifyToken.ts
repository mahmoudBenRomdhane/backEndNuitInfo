const jwt = require("jsonwebtoken");
import { Request, NextFunction, Response } from "express";
const { tokenKey } = require("../config/vars");

module.exports = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  jwt.verify(token, tokenKey, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    } else {
      res.locals.decoded = decoded;
      next();
    }
  });
};
