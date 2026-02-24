import type { Metadata } from "next";
import { Inter, Montserrat, Tenor_Sans } from "next/font/google";
import "./globals.css";
import { CollectionProvider } from "@/contexts/CollectionContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const tenorSans = Tenor_Sans({
  variable: "--font-tenor-sans",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Lookbook - Virtual Staging",
  description: "Virtual staging by real stagers",
  icons: {
    icon: '/Bella-favicon-square.svg',
    shortcut: '/Bella-favicon-square.svg',
    apple: '/Bella-favicon-square.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script 
          type="module" 
          src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
          async
        />
      </head>
      <body className={`${inter.variable} ${montserrat.variable} ${tenorSans.variable} font-sans antialiased`}>
        <style>{`
          /* root-main paddingTop = announcement bar + header inner height
             Values mirror the CSS variables in globals.css per breakpoint:
             Desktop  : 40px announcement + 92px header  = 132px (inline style)
             ≤768px   : 50px announcement + 70px header  = 120px
             ≤480px   : 52px announcement + 70px header  = 122px
             ≤431px   : 50px announcement + 70px header  = 120px          */
          @media (max-width: 768px) {
            .root-main { padding-top: 120px !important; }
          }
          @media (max-width: 480px) {
            .root-main { padding-top: 122px !important; }
          }
          @media (max-width: 431px) {
            .root-main { padding-top: 120px !important; }
          }
        `}</style>
        <AuthProvider>
          <CollectionProvider>
            {/* Header - Fixed at top, present on all pages */}
            <Header />

            {/* Main Content - Dynamic per page */}
            {/* paddingTop (132px) = AnnouncementBar (40px) + Header (92px) — desktop only.
                Mobile overrides via .root-main media queries in <style> above. */}
            <main
              className="root-main"
              style={{
                minHeight: '100vh',
                paddingTop: '132px',
              }}
            >
              {children}
            </main>

            {/* Footer - Present on all pages */}
            <Footer />
          </CollectionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
