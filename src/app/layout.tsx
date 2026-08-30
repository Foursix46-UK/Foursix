import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import SmoothScroll from '@/components/layout/SmoothScroll';
import { Inter, Source_Code_Pro, Manrope } from 'next/font/google';
import ScrollToTop from '@/components/ui/ScrollToTop';
import JsonLd from '@/components/seo/JsonLd';
import { globalGraph, SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/seo';

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

// <-- UPDATED METADATA TO OFFICIAL CLIENT TEXT
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: 'FourSix46® | Building Scalable Ventures Across Industries',
  description: 'FourSix46® Global Ltd is a UK-based parent brand building scalable ventures across technology and emerging industries, with logistics forming part of its structured, system-driven ecosystem.',
  applicationName: SITE_NAME,
  authors: [{ name: 'Dinesh Koyyalamudi', url: 'https://www.46dc.com' }],
  creator: 'FourSix46 Global Ltd',
  publisher: 'FourSix46 Global Ltd',
  category: 'business',

  // Self-referencing canonical fallback. Pages built with buildMetadata() override this
  // with their own absolute URL; anything that forgets still gets a correct one.
  alternates: {
    canonical: './',
  },

  // Site-wide crawl policy: index everything, no snippet or preview limits, so search
  // engines and AI answer engines can quote the content in full.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

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
    siteName: SITE_NAME,
    url: SITE_URL,
    locale: 'en_GB',
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'FourSix46 Global Ltd' }],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'FourSix46® | Building Scalable Ventures Across Industries',
    description: 'A UK-based parent brand building scalable ventures across technology and emerging industries.',
    site: '@FourSix46HQ',
    creator: '@FourSix46HQ',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={`dark ${inter.variable} ${manrope.variable} ${sourceCodePro.variable}`}>
      <head>
        {/* 0. GLOBAL STRUCTURED DATA — Organization + Founder + WebSite.
            Rendered on every page so the entity graph is present site-wide; individual
            pages attach their own nodes by @id rather than repeating this. */}
        <JsonLd data={globalGraph()} id="schema-organization" />

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