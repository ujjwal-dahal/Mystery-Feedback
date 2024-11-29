import databaseConnection from "@/lib/dbConnection";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/User.model";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";


export async function POST(request : NextRequest){
  await databaseConnection();

  const session : any = await getServerSession(authOptions);
  const user : User = session?.user;

  if(!session || !session.user){
    return NextResponse.json({
      message : "Not Authenticated",
      success : false
    },{status : 401})
  }

  const userId = user._id;

  const {acceptMessages} =  await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessage : acceptMessages
      },
      {
        new : true
      }
    )

    if(!updatedUser){
      return NextResponse.json({
        success :false,
        message : "Failed to update user"
      },{status : 401})
    }

    return NextResponse.json({
      success :true,
      message : "Message acceptance status updated successfully",
      updatedUser
    },{status : 200})
    
  } catch (error) {
    console.log("failed to updated user status to accept messages")
    return NextResponse.json({
      message : "failed to updated user status to accept messages",
      success : false
    },{status : 500})
  }
}


export async function GET(request : NextRequest){
  await databaseConnection();

  const session : any = await getServerSession(authOptions);
  const user : User = session?.user;

  if(!session || !session.user){
    return NextResponse.json({
      message : "Not Authenticated",
      success : false
    },{status : 401})
  }

  const userId = user._id;

   try {
    const foundUserById =  await UserModel.findById(userId)
   if(!foundUserById){
    return NextResponse.json({
      success :false,
      message : "Failed to found the user"
    },{status : 500})
   }

   return NextResponse.json({
    success :true,
    isAcceptingMessages : foundUserById.isAcceptingMessage
   },{status : 200})
    
   } catch (error) {
    console.log("Error is getting message acceptance status")
    return NextResponse.json({
      message : "Error is getting message acceptance status",
      success : false
    },{status : 500})
   }
}