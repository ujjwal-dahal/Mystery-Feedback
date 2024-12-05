import mongoose, { Schema, Document } from "mongoose";
import { Message, MessageSchema } from "./Message.model";

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username must be given"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email must be given"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password must be given"],
  },
  verifyCode: {
    type: String,
    required: true,
  },
  verifyCodeExpiry: {
    type: Date,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true, // Default is to accept messages
  },
  messages: [MessageSchema],
});

const UserModel = mongoose.models.User || mongoose.model<User>("User", UserSchema);

export default UserModel;
