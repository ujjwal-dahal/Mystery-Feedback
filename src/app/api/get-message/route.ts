import { getServerSession } from "next-auth";
import UserModel from "@/models/User.model";
import databaseConnection from "@/lib/dbConnection";
import { NextResponse , NextRequest } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request : NextRequest)
{
  await databaseConnection();

  const session : any = await getServerSession(authOptions);
  const user : User = session.user;

  if(!session || !session.user){
    return NextResponse.json({
      message : "Not Authenticated",
      success : false
    },{status : 500})
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const user = await UserModel.aggregate([
      {
        $match : { id : userId}
      },
      {$unwind : "$messages"},
      {$sort : {"messages.createdAt" : -1}},
      {$group : {_id : "$_id", messages : {$push : "$messages"}}}
    ])

    if(!user || user.length ===0){
      return NextResponse.json({
        success : false,
        message : "User not found"
      },{status : 500})
    }

    return NextResponse.json({
      success :false,
      messages : user[0].messages
    },{status : 200})
    
  } catch (error) {
    
  }

}