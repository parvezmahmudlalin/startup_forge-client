import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 🚀 অ্যাসাইনমেন্টের সাথে সঙ্গতিপূর্ণ মেটাডাটা
export const metadata = {
  title: "StartupForge — Startup Team Builder Platform",
  description: "Connect startup founders with talented collaborators.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
       
          {/* Header/Navbar */}
          <Navbar />

          {/* Main Content View (flex-1 নিশ্চিত করবে ফুটার যেন সবসময় নিচে থাকে) */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <Footer />
       
      </body>
    </html>
  );
}