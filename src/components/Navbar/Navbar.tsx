"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import "./Navbar.scss";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link href={"/"}>Mystery Feedback</Link>
        </div>
        <div className="navbar-links">
          <Link href={"/about"}>About</Link>
          <Link href={"/contact"}>Contact</Link>
          <Link href={"/disclaimer"}>Disclaimer</Link>
        </div>
        <div className="navbar-actions">
          {session ? (
            <button className="navbar-btn" onClick={() => signOut()}>
              Sign out
            </button>
          ) : (
            <>
              <Link href={"/sign-up"}>
                <button className="navbar-btn">Sign up</button>
              </Link>
              <Link href={"/sign-in"}>
                <button className="navbar-btn">Sign in</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
