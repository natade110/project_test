import './globals.css';
import { Inter, Noto_Sans_Thai } from 'next/font/google';
import { ReduxProvider } from '@/redux/provider';

// Load fonts
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoSansThai = Noto_Sans_Thai({ 
  subsets: ['thai', 'latin'], 
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-thai'
});

export const metadata = {
  title: 'Authentication System',
  description: 'Full-Stack Software Engineer Interview Project',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${notoSansThai.variable} font-noto-sans-thai`}>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}