import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'TapReview - Get More Google Reviews with One Tap',
  description: 'NFC review cards for businesses. Let customers leave Google reviews with a simple tap. Track analytics, change destinations anytime.',
  keywords: 'NFC, Google Reviews, review cards, business, NFC cards, customer feedback',
  openGraph: {
    title: 'TapReview - Get More Google Reviews with One Tap',
    description: 'NFC review cards for businesses. One tap, instant Google review.',
    type: 'website',
    url: process.env.NEXT_PUBLIC_SITE_URL,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
