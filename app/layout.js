import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StarsBackground from "@/components/StarsBackground";
import ThreeBackgroundWrapper from "@/components/ThreeBackgroundWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata = {
  title: "Portfolio Berredjem Salah",
  description: "A modern 3D portfolio website with admin dashboard and project management features",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <StarsBackground />
        <div role="img" aria-label="3d model background wrapper" className="z-20">
          <ThreeBackgroundWrapper/>
        </div>
        <Navbar/>
        <main className="min-h-screen relative z-10">{children}</main>
        <Footer/>
      </body>
    </html>
  );
}