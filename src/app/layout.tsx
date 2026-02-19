import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import SmoothScroll from '@/components/layout/SmoothScroll';
import { Space_Grotesk, Inter, Source_Code_Pro } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['300', '400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600'],
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
    <html lang="en" className={`dark ${spaceGrotesk.variable} ${inter.variable} ${sourceCodePro.variable}`}>
      <body className="font-body antialiased overflow-x-hidden bg-background text-foreground">
        <SmoothScroll>
          {children}
          <Toaster />
        </SmoothScroll>
      </body>
    </html>
  );
}
