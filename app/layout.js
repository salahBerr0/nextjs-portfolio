import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Navbar from "@/components/layout/Navbar";
import dynamic from "next/dynamic";
import PreloadResources from "@/components/layout/PreloadResources";
import ErrorBoundary from "@/components/fallbacks/ErrorBoundary";
import CriticalFallback from "@/components/fallbacks/CriticalFallback";
import HighPriorityFallback from "@/components/fallbacks/HighPriorityFallback";
import LowPriorityFallback from "@/components/fallbacks/LowPriorityFallback";
import BgFallback from "@/components/fallbacks/BgFallback";

const Footer = dynamic(() => import('@/components/layout/Footer'), {loading: () => (<section className="w-full h-32 flex items-center justify-center border-t"><div className="animate-pulse text-gray-500">Loading footer...</div></section>),});
const Backgrounds = dynamic(() => import('@/components/backgrounds/Backgrounds'), {loading: () => <div className="fixed inset-0 bg-black" />,});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false,
  adjustFontFallback: true,
});

export const metadata = {
  title: "Salah Berredjem - Frontend Developer & Graphic Designer",
  description: "Portfolio showcasing modern web development, 3D graphics, and interactive experiences. Specializing in React, Next.js, and Three.js projects.",
  keywords: "developer, portfolio, react, nextjs, threejs, graphic design, logos",
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
    <html lang="en" className="scroll-smooth">
      <head>
        <PreloadResources />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Start timing when page begins loading
              performance.mark('layout-start');
              
              // Measure when EVERYTHING is loaded
              window.addEventListener('load', function() {
                performance.mark('layout-end');
                performance.measure('full-page-load', 'layout-start', 'layout-end');
                
                const loadTime = performance.getEntriesByName('full-page-load')[0].duration;
                console.log('📊 Full page loaded in:', loadTime.toFixed(0) + 'ms');
              });
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ErrorBoundary  componentName="RootLayout"  fallback={<CriticalFallback />}>
          <ErrorBoundary componentName="Backgrounds" fallback={<BgFallback />}>
            <Backgrounds />
          </ErrorBoundary>

          <ErrorBoundary componentName="Navigation" fallback={<HighPriorityFallback componentName="Navigation" />}>
            <Navbar />
          </ErrorBoundary>
          
          <main className="min-h-screen relative z-20" id="main-content">
            {children}
          </main>

          <ErrorBoundary componentName="Footer" fallback={<LowPriorityFallback componentName="Footer" />}>
            <Footer />
          </ErrorBoundary>
        </ErrorBoundary>
      </body>
    </html>
  );
}