import mongoose , {Schema , Document, Mongoose} from "mongoose";
import { Message, MessageSchema } from "./Message.model";



export interface User extends Document {
  username : string,
  email : string ,
  password : string,
  verifyCode : string ,
  verifyCodeExpiry : Date,
  isVerified : boolean ,
  isAcceptingMessage : boolean ,
  messages : Message[]
}



const UserSchema : Schema<User> = new Schema({
  username : {
    type : String,
    required : [true , "Username must be given"],
    unique : true,
    trim : true
  },
  email :{
    type : String,
    required :  [true , "Email must be given"],
    unique : true,
    trim : true,
    match : [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ , "Please Enter Valid Email Addredd"]
  },
  password : {
    type : String,
    required :  [true , "Password must be given"]
  },
  verifyCode : {
    type : String,
    required :  [true , "Verify Code is required"]
  },
  verifyCodeExpiry : {
    type : Date,
    required :  [true , "Verify Code Expiry is required"]
  },
  isVerified : {
    type : Boolean,
    default : false
  },
  isAcceptingMessage : {
    type : Boolean,
    required :  [true , "Verify Code Expiry is required"]
  },
  messages : [MessageSchema]

  
})


const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema);

export default UserModel;
