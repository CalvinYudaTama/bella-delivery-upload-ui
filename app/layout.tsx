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
        <AuthProvider>
          <CollectionProvider>
            {/* Header - Fixed at top, present on all pages */}
            <Header />

            {/* Main Content - Dynamic per page */}
            <main
              style={{
                minHeight: '100vh',
                paddingTop: '132px', // Announcement bar (40px) + Header (92px actual measured height)
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
