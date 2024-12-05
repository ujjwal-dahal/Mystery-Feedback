import { getServerSession } from "next-auth";
import UserModel from "@/models/User.model";
import databaseConnection from "@/lib/dbConnection";
import { NextResponse, NextRequest } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  await databaseConnection();

  const session : any = await getServerSession(authOptions);
  // console.log("Session:", session); // Log the session

  const _user= session?.user;
  // console.log("User ", _user);

 


  if (!session || !_user) {
    return NextResponse.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }
  const userId = new mongoose.Types.ObjectId(_user._id);
  // const user = await UserModel.findOne({ _id: userId }).select('messages');
  // console.log('User messages:', user?.messages);
  // console.log("userId",userId);
  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: '$messages' },
      { $sort: { 'messages.createdAt': -1 } },
      { $group: { _id: '$_id', messages: { $push: '$messages' } } },
    ]).exec();
    
    console.log("User aggregation result:", user);
    
    if (!user || user.length === 0 || user[0].messages.length === 0) {
      return NextResponse.json(
        { message: 'No messages available for this user', success: false },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { messages: user[0].messages },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return NextResponse.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}