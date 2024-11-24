import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";

import { ApiResponse } from "@/types/ApiResponse";

//emails haru jaile async huncha => eniharu le time lincha

export async function SendVerificationEmail(
email : string,
username : string,
verifyCode : string
) : Promise<ApiResponse>{
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Mystery Feedback | Verification Code',
      react: VerificationEmail({username , otp : verifyCode}),
    });

    return {
      success : true,
      message : "Verification Email sent successfully"
    }
    
  } catch (emailError) {
    console.error("Failed to send verification email", emailError)
    return {
      success : false,
      message : "Failed to send verification email"

    }
    
  }


}