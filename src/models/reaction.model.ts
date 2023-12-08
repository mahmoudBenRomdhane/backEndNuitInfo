export {};
const { Status } = require("../utils/enums");
import { Document, Schema, model } from "mongoose";

interface IReaction {
  userId: Schema.Types.ObjectId;
  postId: Schema.Types.ObjectId;
  status: typeof Status;
}
const reactionSchema = new Schema<IReaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    postId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "PostModel",
    },
    status: {
      type: String,
      enum: Object.values(Status),
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model<IReaction>("Reaction", reactionSchema);
