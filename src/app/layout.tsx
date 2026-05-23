import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import SmoothScroll from '@/components/layout/SmoothScroll';
import { Inter, Source_Code_Pro, Manrope } from 'next/font/google';
import ScrollToTop from '@/components/ui/ScrollToTop';
import Schema from '@/components/seo/Schema'; // <-- ADDED SCHEMA IMPORT

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
  metadataBase: new URL('https://foursix46.com'), 
  
  title: 'FourSix46® | Building Scalable Ventures Across Industries',
  description: 'Official site of FourSix46 Global Ltd (Company No. 16712658) — a London-based parent brand building a multi-industry ecosystem across technology, digital platforms, and modern services. Founded by Dinesh Koyyalamudi (46DC).',
  
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
    description: 'Official site of FourSix46 Global Ltd (Company No. 16712658) — a London-based parent brand building a multi-industry ecosystem across technology, digital platforms, and modern services.',
    siteName: 'FourSix46 Global Ltd',
    url: 'https://foursix46.com', 
    type: 'website',
  }
};

// <-- ADDED GLOBAL SCHEMA BLOCKS 1, 2, AND 3
const globalSchema = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "FourSix46 Global Ltd",
    "legalName": "FOURSIX46 GLOBAL LTD",
    "url": "https://foursix46.com",
    "logo": "https://foursix46.com/logo.png",
    "foundingDate": "2025-09-11",
    "founder": {
      "@type": "Person",
      "name": "Dinesh Koyyalamudi",
      "alternateName": "46DC",
      "url": "https://46dc.com"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "66 Paul Street",
      "addressLocality": "London",
      "addressRegion": "England",
      "postalCode": "EC2A 4NA",
      "addressCountry": "GB"
    },
    "identifier": [
      {
        "@type": "PropertyValue",
        "name": "Companies House Number",
        "value": "16712658"
      }
    ],
    "sameAs": [
      "https://x.com/the46dc",
      "https://instagram.com/the46dc",
      "https://youtube.com/@the46dc",
      "https://facebook.com/the46dc",
      "https://www.linkedin.com/company/foursix46/"
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Dinesh Koyyalamudi",
    "alternateName": "46DC",
    "jobTitle": "Founder",
    "url": "https://46dc.com",
    "image": "https://46dc.com/founder-photo.jpg",
    "worksFor": {
      "@type": "Organization",
      "name": "FourSix46 Global Ltd",
      "legalName": "FOURSIX46 GLOBAL LTD",
      "url": "https://foursix46.com",
      "identifier": "16712658"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "London",
      "addressRegion": "England",
      "addressCountry": "GB"
    },
    "sameAs": [
      "https://www.linkedin.com/in/the46dc/"
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "FourSix46® — The Parent Brand",
    "alternateName": "FourSix46 Global Ltd",
    "url": "https://foursix46.com",
    "description": "Official site of FourSix46 Global Ltd (Company No. 16712658) — a London-based parent brand building a multi-industry ecosystem across technology, digital platforms, and modern services. Founded by Dinesh Koyyalamudi (46DC).",
    "inLanguage": "en-GB",
    "publisher": {
      "@type": "Organization",
      "name": "FourSix46 Global Ltd",
      "url": "https://foursix46.com"
    },
    "author": {
      "@type": "Person",
      "name": "Dinesh Koyyalamudi",
      "alternateName": "46DC",
      "url": "https://46dc.com"
    }
  }
];

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
        {/* <-- INJECTED SCHEMA COMPONENT HERE */}
        <Schema data={globalSchema} /> 
        
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