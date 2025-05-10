import './globals.css';
import { Noto_Sans_Thai } from 'next/font/google';
import { ReduxProvider } from '@/redux/provider';

// Load Noto Sans Thai font with all required weights
const notoSansThai = Noto_Sans_Thai({ 
  subsets: ['thai', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-thai',
  display: 'swap', // Ensures text remains visible during font loading
});

// Separate viewport export (this is the key change)
export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  title: 'Authentication System',
  description: 'Full-Stack Software Engineer Interview Project',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={notoSansThai.variable}>
      <body className="font-noto-sans-thai bg-white min-h-screen">
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}