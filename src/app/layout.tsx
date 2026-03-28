import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/mona-sans';
import './globals.css';
import { Nav }    from '@/components/Nav';
import { Footer } from '@/components/Footer';

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
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col antialiased">
        <Nav />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
