import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserStateProvider } from "../context/UserStateContext";
import MobileFrame from "../components/MobileFrame";
import BottomNav from "../components/BottomNav";
import XPBurst from "../components/XPBurst";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevHub Launchpad",
  description: "A high-dopamine gamified platform for ambitious developers. Ship daily, build DNA, and connect with Indian start-up communities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-black">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full overflow-hidden`}>
        <UserStateProvider>
          <MobileFrame overlay={
            <>
              <BottomNav />
              <XPBurst />
            </>
          }>
            {children}
          </MobileFrame>
        </UserStateProvider>
      </body>
    </html>
  );
}
