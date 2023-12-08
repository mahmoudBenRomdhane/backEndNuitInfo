export {};
import { NextFunction, Response, Request } from "express";
import { PostModel } from "../models";

exports.createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.decoded;
    const { content, image } = req.body;
    await new PostModel({
      content: content,
      image: image,
      upvote: 0,
      downVote: 0,
      userId: user.userId,
    }).save();
    res.status(200).json({ message: "created" });
  } catch (err) {
    console.log("err", err);

    res.send(err);
  }
};
exports.list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await PostModel.find();
    res.status(200).json({
      posts: posts,
    });
  } catch (err) {
    res.status(400).json({
      message: "error",
    });
  }
};
// exports.getUserReaction = async (req : Request , res : Response , next : NextFunction) => {
//   try{
//     const user = res.locals.decoded;

//   }catch(err){

//   }
// }
