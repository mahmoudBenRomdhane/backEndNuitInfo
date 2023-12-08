import { NextFunction, Request, Response } from "express";

export const uploadFile = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json({ fileName: req.file.filename });
    return next();
  } catch (err) {
    res.status(400).json({ message: "Error uploading file" });
  }
};
