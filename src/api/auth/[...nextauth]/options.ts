import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import databaseConnection from "@/lib/dbConnection";
import UserModel from "@/models/User.model";



export const authOptions = {
  providers : [

    Credentials({
      name : "Credentials",
      credentials : {
        email : {
          label : "Email",
          type : "email"
        },
        password : {
          label :"Password", 
          type : "password"
        },
      },

      authorize : async (credentials : any) : Promise<any>=>{

        await databaseConnection();

        try {
          const {email , password} = credentials;

         const existingUser =  await UserModel.findOne({
            $or : [
              {email},
              {username : credentials}
            ]
          }) 

          if(!existingUser){
            throw new Error("No user found with this email")
          }

          if(!existingUser.isVerified){
            throw new Error("Please verify your account before login")
          }

          const isPasswordMatched =  await bcrypt.compare(password , existingUser.password)
          if(isPasswordMatched){
            return existingUser;
          }
          else{
            throw new Error("Incorrect Password")
          }
          
        } catch (error : any) {
          throw new Error(error)
          
        }



      }
    }),

    Google({
      clientId : process.env.GOOGLE_CLIENT_ID,
      clientSecret : process.env.GOOGLE_CLIENT_SECRET
    }),   
  ]

  ,
  pages : {
    signIn : "signin",
  },

  session : {
    strategy: "jwt",
  },

  secret : process.env.NEXTAUTH_SECRET,

  callbacks : {
    async jwt({ token , user } : any)  {
      //token lai modify gareko
      if(user){
      token._id = user._id?.toString()
      token.isVerified = user.isVerified
      token.isAcceptingMessage = user.isAcceptingMessage
      token.username = user.username
      }
      return token
    },
    async session({ session, token } : any) {
      if(token){
        session.user._id = token._id as string
        session.user.isVerified = token.isVerified as boolean
        session.user.isAcceptingMessage = token.isAcceptingMessage as boolean
        session.user.username = token.username as string

        
      }
      
      return session
    },
    
  }
} as any;