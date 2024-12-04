import { Message } from "@/models/Message.model";


export interface ApiResponse{
  success : boolean,
  message : string,
  isAcceptingMessages ? : boolean, //question mark dida optional huncha 
  messages ?: Array<Message>
}