import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Navbar from "@/components/Navbar";
import dynamic from "next/dynamic";
import PreloadResources from "@/components/PreloadResources";
import ErrorBoundary from "@/components/ErrorBoundary";
import CriticalFallback from "@/components/fallbacks/CriticalFallback";
import HighPriorityFallback from "@/components/fallbacks/HighPriorityFallback";
import LowPriorityFallback from "@/components/fallbacks/LowPriorityFallback";
import BgFallback from "@/components/fallbacks/BgFallback";
import MediumPriorityFallback from "@/components/fallbacks/MediumPriorityFallback";

const Footer = dynamic(() => import('@/components/Footer'), {loading: () => (<section className="w-full h-32 flex items-center justify-center border-t"><div className="animate-pulse text-gray-500">Loading footer...</div></section>)});
const Backgrounds = dynamic(() => import('@/components/Backgrounds'), {loading: () => <div className="fixed inset-0 bg-black" />});

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
  title: "Salah Berredjem - Full Stack Developer & 3D Artist",
  description: "Portfolio showcasing modern web development, 3D graphics, and interactive experiences. Specializing in React, Next.js, and Three.js projects.",
  keywords: "developer, portfolio, react, nextjs, threejs, 3D artist",
  authors: [{ name: "Salah Berredjem" }],
  openGraph: {
    title: "Salah Berredjem - Portfolio",
    description: "Modern 3D portfolio with admin dashboard",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <PreloadResources />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ErrorBoundary componentName="Backgrounds" fallback={<BgFallback />}>
          <Backgrounds />
        </ErrorBoundary>

        <ErrorBoundary  componentName="Application" fallback={<CriticalFallback />}>          
          <ErrorBoundary componentName="Navigation" fallback={<HighPriorityFallback componentName="Navigation" />}>
            <Navbar/>
          </ErrorBoundary>
          
          <main className="min-h-screen relative z-20">
            {children}
          </main>

          <ErrorBoundary componentName="Footer" fallback={<LowPriorityFallback componentName="Footer" />}>
            <Footer/>
          </ErrorBoundary>

        </ErrorBoundary>
      </body>
    </html>
  );
}