'use client';

import SafeProvider from '@safe-global/safe-apps-react-sdk';
import './globals.css';
import { Inter } from 'next/font/google';
import { FlashMessageProvider } from '@/helpers/UseFlashMessage';
import Navigation from '@/components/Navigation';
import FlashMessage from '@/components/FlashMessage';

const inter = Inter({ subsets: ['latin'] });

const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-gray-100">
      <body className="h-full">
        <FlashMessageProvider>
          <SafeProvider
            loader={
              <>
                <div>Waiting for Safe...</div>
              </>
            }
          >
            <div className="min-h-full">
              <Navigation></Navigation>
              {children}
            </div>
          </SafeProvider>
          <FlashMessage />
        </FlashMessageProvider>
      </body>
    </html>
  );
}

function classNames(...classes: Array<string>) {
  return classes.filter(Boolean).join(' ');
}
