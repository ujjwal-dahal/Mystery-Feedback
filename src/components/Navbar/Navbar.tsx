"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import "./Navbar.scss";

const Navbar = () => {
  const { data: session } = useSession();

  const user: User = session?.user as User;

  return (
    <>
      <div className="navbar">
        <div className="title">
          <Link href={"/"}>Mystery Feedback</Link>
        </div>
        <div className="link">
          <Link href={"/about"}>About</Link>
          <Link href={"/contact"}>Contact</Link>
          <Link href={"/disclaimer"}>Disclaimer</Link>
        </div>
        <div className="button-area">
          {session ? (
            <button onClick={() => signOut()}>Signout</button>
          ) : (
            <>
              <Link href={"/sign-up"}>
                <button>Signup</button>
              </Link>
              <Link href={"/sign-in"}>
                <button>Signin</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
