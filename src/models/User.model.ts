import mongoose , {Schema , Document} from "mongoose";
import { Message } from "./Message.model";



export interface User extends Document {
  username : string,
  email : string ,
  password : string,
  verifyCode : string ,
  verifyCodeExpiry : Date,
  isAcceptingMessage : boolean ,
  message : Message[]
}



const UserSchema = new Schema({
  username : {
    type : String,
    required : true
  },
  email :{
    type : String,
    required : true
  },
  password : {
    type : String,
    required : true
  },
  verifyCode : String,
  verifyCodeExpiry : Date,
  isAcceptingMessage : Boolean
  
})
