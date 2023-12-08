export {};
import { NextFunction, Response, Request } from "express";
import { PostModel, Reaction } from "../models";

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
    const posts = await PostModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          image: 1,
          upvote: 1,
          downVote: 1,
          "user.firstName": 1,
          "user.lastName": 1,
        },
      },
    ]);

    res.status(200).json({
      posts: posts,
    });
  } catch (err) {
    res.status(400).json({
      message: "error",
    });
  }
};

exports.getReactedPostByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.decoded;
    const reactions = Reaction.find({
      userId: user.userId,
    });
    res.status(200).json({
      reactions: reactions,
    });
  } catch (err) {
    res.status(400).json({
      message: "error",
    });
  }
};
exports.addReaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId, status } = req.body;
    const user = res.locals.decoded;
    await new Reaction({
      postId: postId,
      userId: user.userId,
      status: status,
    });
  } catch (err) {
    res.status(400).json({
      message: "err",
    });
  }
};
