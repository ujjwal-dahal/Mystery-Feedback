import NextAuth from "next-auth";
import { authOptions } from "./options";


const handler = NextAuth(authOptions)