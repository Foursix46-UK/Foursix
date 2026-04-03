import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import SmoothScroll from '@/components/layout/SmoothScroll';
import { Inter, Source_Code_Pro, Manrope } from 'next/font/google';
import ScrollToTop from '@/components/ui/ScrollToTop';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-source-code-pro',
});

export const metadata: Metadata = {
  title: 'FourSix46 | House of Multibrands',
  description: 'A premium, multi-brand holding company specializing in luxury and neo-brutalism design.',
  
  // 👇 NEW ICONS & MANIFEST CONFIGURATION 👇
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  
  // 👇 OPEN GRAPH FOR SOCIAL SHARING 👇
  openGraph: {
    title: 'FourSix46 | House of Multibrands',
    description: 'A premium, multi-brand holding company specializing in luxury and neo-brutalism design.',
    siteName: 'FourSix46',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${manrope.variable} ${sourceCodePro.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground selection:bg-primary selection:text-white">
        <SmoothScroll>
          {/* 👇 STRICT WRAPPER: This absolutely kills horizontal mobile scrolling */}
          <main className="relative flex min-h-screen flex-col w-full max-w-[100vw] overflow-x-hidden">
            {children}
          </main>
          <ScrollToTop />
          <Toaster />
        </SmoothScroll>
      </body>
    </html>
  );
}