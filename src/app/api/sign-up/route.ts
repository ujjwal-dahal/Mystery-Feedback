
import { NextResponse , NextRequest } from "next/server";
import databaseConnection from "@/lib/dbConnection";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";
import { SendVerificationEmail } from "@/helpers/sendVerificationEmail";

export const POST = async (request : NextRequest)=>{
  
  await databaseConnection(); //database connection
  //databaseconnection harek route ma run garaunu parcha kina ki Next.js Edge ma run huncha

  try {

    const reqBody = await request.json();
    const {username , email , password} = reqBody;

    const existingUserVerifiedByUsername = await UserModel.findOne({username , isVerified : true});
    
    if(existingUserVerifiedByUsername){

      return NextResponse.json({
        success : false, //user already cha so success false
        message : "Username is already taken"

      },{status : 400})
    }

    const existingUserByEmail = await UserModel.findOne({email});
    const verifyCodeOTP = Math.floor(100000 + Math.random() * 900000).toString();

    if(existingUserByEmail){
      if(existingUserByEmail.isVerified){
        return NextResponse.json({
          success : false,
          message : "User is already exist with this Email"
        },{status : 400})
      }
      else{
        const hashedPassword = await bcrypt.hash(password , 10)
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCodeOTP;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)

        await existingUserByEmail.save();
      }

    }
    else{
      const hashedPassword = await bcrypt.hash(password , 10)
      const expiryDate = new Date(); //malai aile esle current date diyo
      expiryDate.setHours(expiryDate.getHours() + 1)

     const newUser =  new UserModel({
        username,
        email,
        password : hashedPassword,
        verifyCode : verifyCodeOTP ,
        verifyCodeExpiry : expiryDate,
        isVerified : false ,
        isAcceptingMessage : true ,
        messages : []
      })

      const savedUser = await newUser.save();
    }

    //send verification email

    const emailResponse = await SendVerificationEmail(email , username , verifyCodeOTP)
    if(!emailResponse.success){
      return NextResponse.json({
        success : false,
        message : emailResponse.message,
      },{status : 500})
    }

    return NextResponse.json({
      success : true,
      message : "User registered successfully . Please Verify Your Email"

    },{status : 200})
    
  } catch (error) {
    console.error("Error registering user",error) //yo backend terminal ma jancha
    return NextResponse.json({
      success : false,
      message : "Error registering user"
    },{
      status : 500
    }) //yo frontend ma dekhincha
    
  }



}