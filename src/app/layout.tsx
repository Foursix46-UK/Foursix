import type { Metadata } from 'next';
import Script from 'next/script';
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
  metadataBase: new URL('https://foursix46.com'), 
  
  title: 'FourSix46® | Building Scalable Ventures Across Industries',
  description: 'FourSix46® Global Ltd is a UK-based parent brand building scalable ventures across technology and emerging industries, with logistics forming part of its structured, system-driven ecosystem.',
  
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  
  openGraph: {
    title: 'FourSix46® | Building Scalable Ventures Across Industries',
    description: 'FourSix46® Global Ltd is a UK-based parent brand building scalable ventures across technology and emerging industries, with logistics forming part of its structured, system-driven ecosystem.',
    siteName: 'FourSix46',
    url: 'https://foursix46.com', 
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${manrope.variable} ${sourceCodePro.variable}`}>
      <head>
        {/* 1. GOOGLE CONSENT MODE V2 */}
        <Script id="consent-mode" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'denied'
            });
          `}
        </Script>

        {/* 2. COOKIEYES SCRIPT */}
        <Script
          id="cookieyes"
          strategy="beforeInteractive"
          src="https://cdn-cookieyes.com/client_data/c72eb5e7f0cc48b2ca131f31d7ad48cd/script.js"
        ></Script>

        {/* 3. GOOGLE ANALYTICS */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-Y075KW6JBJ`}
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Y075KW6JBJ');
          `}
        </Script>
      </head>
      <body className="font-sans antialiased bg-background text-foreground selection:bg-primary selection:text-white">
        <SmoothScroll>
          <main className="relative flex min-h-screen flex-col w-full">
            {children}
          </main>
          <ScrollToTop />
          <Toaster />
        </SmoothScroll>
      </body>
    </html>
  );
}