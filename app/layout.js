import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StarsBackground from "@/components/StarsBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // Add for better font loading
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata = {
  title: "Portfolio Berredjem Salah",
  description: "A modern 3D portfolio website with admin dashboard and project management features",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <StarsBackground />
        <Navbar/>
        <main className="min-h-screen relative z-10">{children}</main>
        <Footer/>
      </body>
    </html>
  );
}