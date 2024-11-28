import databaseConnection from "@/lib/dbConnection";
import UserModel from "@/models/User.model";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextRequest, NextResponse } from "next/server";

export const UsernameQuerySchema = z.object({
  username : usernameValidation
})

export const GET = async (request : NextRequest)=>{
  await databaseConnection();

  try {
    const {searchParams} = new URL(request.url);
    const usernameFromUrl = {
      username : searchParams.get("username")
    }

    //validation with ZOD
   const result = UsernameQuerySchema.safeParse(usernameFromUrl);
   if(!result.success){
    const usernameErrors = result.error.format().username?._errors || []
    return NextResponse.json({
      success : false,
      message : usernameErrors?.length > 0  ? usernameErrors.join(",") : "Invalid Query Parameters",
    },{status : 500})
   }

   const {username} = result.data;

   const existingVerifiedUser = await UserModel.findOne({username , isVerified : true})
   if(existingVerifiedUser){
    return NextResponse.json({
      success : false,
      message : "Username is already taken"
    },{status : 400})
   }

   return NextResponse.json({
    success : true,
    message : "Username is available"
  },{status : 200})


   

    
  } catch (error) {

    console.log("Error Checking Username" , error)
    return NextResponse.json({
      message : "Error Checking Username",
      success : false
    },{status : 500})
    
  }


}