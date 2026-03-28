import type { Metadata, Viewport } from 'next';
import { DM_Sans, DM_Mono } from 'next/font/google';
import './globals.css';
import { Nav }    from '@/components/Nav';
import { Footer } from '@/components/Footer';

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets:  ['latin'],
  weight:   ['300', '400', '500', '600', '700', '900'],
  style:    ['normal', 'italic'],
});

const dmMono = DM_Mono({
  variable: '--font-dm-mono',
  subsets:  ['latin'],
  weight:   ['400', '500'],
});

export const metadata: Metadata = {
  title:       'SignBridge Ghana',
  description: 'Learn, translate, and communicate in Ghanaian Sign Language using real-time hand detection.',
  keywords:    ['Ghanaian Sign Language', 'GSL', 'sign language', 'Ghana', 'accessibility'],
};

export const viewport: Viewport = {
  themeColor: '#1D9E75',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <Nav />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
