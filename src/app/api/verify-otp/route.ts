import databaseConnection from "@/lib/dbConnection";
import UserModel from "@/models/User.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request : NextRequest){
  await databaseConnection();

  try {
    const requestData = await request.json();
    const {username , code} = requestData;

    const decodedUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({username : decodedUsername})

    if(!user)
{
  return NextResponse.json({
    success :false,
    message : "User not found"
  },{status : 500})
}    

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
    
    if(isCodeValid && isCodeNotExpired){
      user.isVerified = true;
      await user.save();

      return NextResponse.json({
        success : false,
        message : "Account verified successfully"
      },{status : 200})
    }

    else if(!isCodeNotExpired){
      return NextResponse.json({
        succes : false,
        message : "Verification Code Has Expired"
      },{status : 500})
    }

    else {
      return NextResponse.json({
        message : "Verification code is false",
        success : false
      },{status : 500})
    }
  } catch (error) {
    console.log("Error in verifying User", error)
    return NextResponse.json({
      success : false,
      message : "Error in verifying User"
    },{status : 400})
  }
}