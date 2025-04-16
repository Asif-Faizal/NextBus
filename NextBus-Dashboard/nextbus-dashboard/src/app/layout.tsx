'use client';

import { Geist, Geist_Mono } from "next/font/google";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Provider } from 'react-redux';
import { store } from '../store';
import GradientBackground from '@/components/GradientBackground';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { useEffect } from 'react';

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

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      }
    }
  }, []);

  return (
    <GradientBackground isDarkMode={isDarkMode}>
      {children}
    </GradientBackground>
  );
};

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
          <ThemeProvider>
            <LayoutContent>
              {children}
            </LayoutContent>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
