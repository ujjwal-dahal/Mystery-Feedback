import UserModel from "@/models/User.model";
import databaseConnection from "@/lib/dbConnection";
import { Message } from "@/models/Message.model";
import { NextRequest, NextResponse } from "next/server";



export async function POST(request : NextRequest){
  await databaseConnection();

  const {username , content} = await request.json();

  try {
    const user = await UserModel.findOne({username});
    if(!user){
      return NextResponse.json({
        success : false,
        message : "User not found"
      },{status : 500})
    }

    //is user accepting the messages
    if(!user.isAcceptingMessage){
      return NextResponse.json({
        success :false,
        message : 'User is not accepting message'
      },{status : 500})
    }

    const newMessage = {content , createdAt : new Date()}
    user.messages.push(newMessage as Message);
    await user.save();
    return NextResponse.json({
      success :true,
      message : "Message sent successfully"
    },{status : 200})
  } catch (error) {
    console.log("Error adding messages",error)
    return NextResponse.json({
      success :true,
      message : "An Unexpected Error"
    },{status : 200})
  }
}