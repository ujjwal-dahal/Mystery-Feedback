import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";

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
          {children}
          <Toaster />
      </body>
        </AuthProvider>
    </html>
  );
}
