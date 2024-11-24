import { Message } from "@/models/Message.model";


export interface ApiResponse{
  success : boolean,
  message : string,
  isAcceptingMessage ? : boolean, //question mark dida optional huncha 
  messages ?: Array<Message>
}