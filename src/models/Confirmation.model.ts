export {};
import { Document, Schema, model } from "mongoose";

interface IConfirmation extends Document {
  user: Schema.Types.ObjectId;
  ConfirmationCode: string;
  createdAt: Date;
  uuid: string;
}

const ConfirmationSchema = new Schema<IConfirmation>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      unique: true,
    },
    ConfirmationCode: {
      type: String,
      required: true,
    },
    uuid: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model<IConfirmation>("Confirmation", ConfirmationSchema);
