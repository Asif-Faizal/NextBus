'use client';

import React from 'react';
import { useAppSelector } from '@/store/hooks';
import { useTheme } from '@/context/ThemeContext';
import { theme } from '@/theme/theme';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isDarkMode } = useTheme();
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);

  const sidebarItems = [
    { name: 'Dashboard', path: '/home' },
    { name: 'Buses', path: '/home/buses' },
    { name: 'Routes', path: '/home/routes' },
    { name: 'Stops', path: '/home/stops' },
    { name: 'Ads', path: '/home/ads' },
    { name: 'Settings', path: '/home/settings' },
  ];

  const textColor = isDarkMode ? theme.colors.dark.text.primary : theme.colors.light.text.primary;
  const bgColor = isDarkMode ? theme.colors.dark.surface : theme.colors.light.surface;
  const sidebarBg = isDarkMode ? theme.colors.dark.card.background : theme.colors.light.card.background;
  const headerBg = isDarkMode ? theme.colors.dark.card.background : theme.colors.light.card.background;
  const primaryColor = isDarkMode ? theme.colors.dark.primary : theme.colors.light.primary;

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: bgColor }}>
      {/* Sidebar */}
      <div 
        className="w-64 fixed h-screen p-4"
        style={{ backgroundColor: sidebarBg }}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold" style={{ color: textColor, fontFamily: theme.fontFamily.primary }}>
            NextBus
          </h1>
        </div>
        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`block p-3 rounded-lg transition-colors ${
                pathname === item.path ? 'text-white' : 'hover:bg-gray-200'
              }`}
              style={{ 
                color: pathname === item.path ? 'white' : textColor,
                fontFamily: theme.fontFamily.primary,
                backgroundColor: pathname === item.path ? primaryColor : 'transparent'
              }}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header 
          className="h-16 flex items-center justify-between px-8 fixed w-[calc(100%-16rem)]"
          style={{ backgroundColor: headerBg }}
        >
          <div>
            <h2 className="text-xl font-semibold" style={{ color: textColor, fontFamily: theme.fontFamily.primary }}>
              Welcome, {user?.username}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8 mt-16">
          {children}
        </main>
      </div>
    </div>
  );
} 