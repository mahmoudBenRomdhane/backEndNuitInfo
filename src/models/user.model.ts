export {};
const { Gender, Role, Question } = require("../utils/enums");
import { Document, Schema, model } from "mongoose";

interface IDevice {
  os: string;
  browser: string;
  ipAddress: string;
  verified: boolean;
  deviceId?: string;
}
interface ISecurityQuestion {
  question: typeof Question;
  response: string;
}
interface IUser extends Document {
  email: string;
  firstName?: string;
  lastName?: string;
  password: string;
  gender: typeof Gender;
  createdAt: Date;
  updatedAt: Date;
  role: typeof Role;
  emailVerified: boolean;
  devices?: IDevice[];
  securityQuestion: ISecurityQuestion;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      lowercase: true,
      required: true,
      validate: {
        validator: function (value: string) {
          return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
        },
        message: "Invalid email format",
      },
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
      required: true,
    },
    password: {
      type: String,
      required: true,
      // validate: {
      //   validator: function (value: string) {
      //     const passwordRegex =
      //       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{16,}$/;
      //     return passwordRegex.test(value);
      //   },
      //   message: "Invalid password format",
      // },
    },
    role: {
      type: String,
      enum: Object.values(Role),
      required: true,
    },
    emailVerified: {
      type: Boolean,
      required: true,
    },
    devices: [
      {
        os: {
          type: String,
        },
        browser: {
          type: String,
        },
        ipAddress: {
          type: String,
        },
        verified: {
          type: String,
        },
        deviceId: {
          type: String,
        },
      },
    ],
    securityQuestion: {
      question: {
        type: String,
        required: true,
      },
      response: {
        type: String,
        required: true,
      },
    },
  },

  {
    timestamps: true,
  }
);

userSchema.statics.isEmailTaken = async function (email: string) {
  const user = await this.findOne({ email: email });
  return !!user;
};

module.exports = model<IUser>("User", userSchema);
