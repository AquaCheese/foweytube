'use client';

import Link from 'next/link';
import { 
  Home, 
  TrendingUp, 
  Users, 
  Clock, 
  ThumbsUp, 
  PlaySquare,
  Music,
  Gamepad2,
  Trophy,
  Film,
  Newspaper
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
}

export default function Sidebar({ isOpen = true }: SidebarProps) {
  const mainLinks = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/trending', icon: TrendingUp, label: 'Trending' },
    { href: '/subscriptions', icon: Users, label: 'Subscriptions' },
  ];

  const libraryLinks = [
    { href: '/history', icon: Clock, label: 'History' },
    { href: '/liked', icon: ThumbsUp, label: 'Liked videos' },
    { href: '/playlists', icon: PlaySquare, label: 'Playlists' },
  ];

  const exploreLinks = [
    { href: '/category/music', icon: Music, label: 'Music' },
    { href: '/category/gaming', icon: Gamepad2, label: 'Gaming' },
    { href: '/category/sports', icon: Trophy, label: 'Sports' },
    { href: '/category/movies', icon: Film, label: 'Movies' },
    { href: '/category/news', icon: Newspaper, label: 'News' },
  ];

  if (!isOpen) {
    return (
      <aside className="hidden md:block w-16 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-2 space-y-2">
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <link.icon className="h-6 w-6" />
              <span className="text-xs mt-1">{link.label}</span>
            </Link>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className="hidden md:block w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        {/* Main Navigation */}
        <nav className="space-y-1">
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <link.icon className="h-5 w-5 mr-3" />
              {link.label}
            </Link>
          ))}
        </nav>

        <hr className="my-4 border-gray-200" />

        {/* Library */}
        <div>
          <h3 className="px-3 py-2 text-sm font-medium text-gray-900 uppercase tracking-wider">
            Library
          </h3>
          <nav className="space-y-1">
            {libraryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <link.icon className="h-5 w-5 mr-3" />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <hr className="my-4 border-gray-200" />

        {/* Explore */}
        <div>
          <h3 className="px-3 py-2 text-sm font-medium text-gray-900 uppercase tracking-wider">
            Explore
          </h3>
          <nav className="space-y-1">
            {exploreLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <link.icon className="h-5 w-5 mr-3" />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
