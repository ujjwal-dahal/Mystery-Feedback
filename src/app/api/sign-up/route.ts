import { NextResponse, NextRequest } from "next/server";
import databaseConnection from "@/lib/dbConnection";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";
import { SendVerificationEmail } from "@/helpers/sendVerificationEmail";

export const POST = async (request: NextRequest) => {

  // if(request.method !== "GET"){
  //   return NextResponse.json({
  //     success : false,
  //     message : "Method Not Allowed"
  //   },{status : 400})
  // }

  // Connect to the database
  await databaseConnection();

  try {
    // Parse the request body
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    // Validate username length
    if (username.length <= 5) {
      return NextResponse.json(
        {
          message: "Username must be greater than 5 characters",
          success: false,
        },
        { status: 400 }
      );
    }

    // Check if the username is already taken by a verified user
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return NextResponse.json(
        {
          success: false, // User already exists, success is false
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    // Check if a user already exists with the same email
    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCodeOTP = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        // If the user is already verified
        return NextResponse.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 }
        );
      } else {
        // If the user exists but is not verified, update their details
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the new password
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCodeOTP;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1-hour expiry

        await existingUserByEmail.save();
      }
    } else {
      // If no user exists, create a new one
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1); // Set the OTP expiry time to 1 hour from now

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode: verifyCodeOTP,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    // Send the verification email
    const emailResponse = await SendVerificationEmail(email, username, verifyCodeOTP);
    if (!emailResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email.",
      },
      { status: 200 }
    );
  } catch (error) {
    // Log the error to the server console
    console.error("Error registering user", error);

    // Return error response
    return NextResponse.json(
      {
        success: false,
        message: "Error registering user",
      },
      { status: 500 }
    );
  }
};
