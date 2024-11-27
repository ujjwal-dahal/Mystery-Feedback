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
   

    
  } catch (error) {

    console.log("Error Checking Username" , error)
    return NextResponse.json({
      message : "Error Checking Username",
      success : false
    },{status : 500})
    
  }


}