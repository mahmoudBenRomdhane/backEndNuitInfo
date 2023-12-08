export {};
const { Gender, Role, Question } = require("../utils/enums");
import { Document, Schema, model } from "mongoose";

interface Ipost {
  userId: Schema.Types.ObjectId;
  content: string;
  image?: string;
  upvote: number;
  downVote: number;
}
const postSchema = new Schema<Ipost>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    content: {
      type: String,
    },
    image: {
      type: String,
      required: false,
    },
    upvote: {
      type: Number,
      required: true,
    },
    downVote: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model<Ipost>("PostModel", postSchema);
