'use client';

import { Geist, Geist_Mono } from "next/font/google";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Provider } from 'react-redux';
import { store } from '../store';
import GradientBackground from '@/components/GradientBackground';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} antialiased`}
      >
        <Provider store={store}>
          <GradientBackground isDarkMode={false}>
            {children}
          </GradientBackground>
        </Provider>
      </body>
    </html>
  );
}
