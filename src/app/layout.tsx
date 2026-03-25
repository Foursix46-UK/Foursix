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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // FIX: Added max-w-[100vw] and overflow-x-hidden strictly to the root html
    <html lang="en" className={`dark ${inter.variable} ${manrope.variable} ${sourceCodePro.variable} max-w-[100vw] overflow-x-hidden`}>
      {/* FIX: Applied the same locks to the body tag */}
      <body className="font-sans antialiased max-w-[100vw] overflow-x-hidden bg-background text-foreground">
        <SmoothScroll>
          {children}
          <ScrollToTop />
          <Toaster />
        </SmoothScroll>
      </body>
    </html>
  );
}