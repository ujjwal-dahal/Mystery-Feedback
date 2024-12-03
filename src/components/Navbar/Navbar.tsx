"use client";
import Link from "next/link";
import { useSession , signOut } from "next-auth/react";
import { User } from "next-auth";


const Navbar = ()=>{
  const {data} = useSession();
  

return <>

</>

}


export default Navbar;