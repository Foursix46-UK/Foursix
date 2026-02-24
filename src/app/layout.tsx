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
    <html lang="en" className={`dark ${inter.variable} ${manrope.variable} ${sourceCodePro.variable}`}>
      <body className="font-sans antialiased overflow-x-hidden bg-background text-foreground">
        <SmoothScroll>
          {children}
          <ScrollToTop />
          <Toaster />
        </SmoothScroll>
      </body>
    </html>
  );
}
