import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar/Navbar";
import {ToastContainer} from "react-toastify";
import "../../node_modules/react-toastify/dist/ReactToastify.css"

export const metadata: Metadata = {
  title: "Mystery Feedback",
  description: "This is Mystery Feedback Web App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en"> 
    <AuthProvider>
      <body> 
        <Navbar />
          {children}
          <Toaster />
          <ToastContainer />
      </body>
        </AuthProvider>
    </html>
  );
}
