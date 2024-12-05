"use client";

import { useParams } from "next/navigation";
import "./UserPage.scss";

export default function UserPage() {
  const params = useParams(); 
  const username = params.username; 

  return (
    <>
      <h1>Username: {username}</h1>
    </>
  );
}
