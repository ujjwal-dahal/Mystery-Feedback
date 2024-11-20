import mongoose , {Schema , Document} from "mongoose";

export interface Message extends Document{
  content : string,
  createdAt : Date
}


export const MessageSchema : Schema<Message> = new Schema({
  content : {
    type : String,
    required : true
  },

  createdAt : {
    type : Date,
    required : true,
    default : Date.now
  }
})


const MessageModel = ( mongoose.models.Messages as mongoose.Model<Message>) || mongoose.model<Message>("Messages",MessageSchema)

export default MessageModel;