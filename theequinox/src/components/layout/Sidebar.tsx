'use client';

import { Home, TrendingUp, Briefcase, BarChart3, Heart, Settings, Clock, Zap } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/trading', icon: TrendingUp, label: 'Trading' },
    { href: '/portfolio', icon: Briefcase, label: 'Portfolio' },
    { href: '/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/watchlist', icon: Heart, label: 'Watchlist' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-equinox-darker via-equinox-dark to-equinox-darker border-r border-gold-500/20 min-h-screen flex flex-col sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gold-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gold-gradient flex items-center justify-center">
            <Zap className="w-6 h-6 text-equinox-darker" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-gold-400">
              THE EQUINOX
            </h1>
            <p className="text-xs text-gold-300/60">Royal Luxe Trading</p>
          </div>
        </div>
      </div>

      {/* Market Status */}
      <div className="px-6 py-4 border-b border-gold-500/20">
        <div className="bg-equinox-purple/30 border border-gold-500/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-medium text-gold-300">Market Status</span>
          </div>
          <p className="text-sm text-equinox-light">Market Open</p>
          <p className="text-xs text-gold-300/60 mt-1">9:15 AM - 3:30 PM IST</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300',
                isActive
                  ? 'bg-gold-gradient text-equinox-darker font-semibold shadow-gold'
                  : 'text-equinox-light hover:bg-equinox-purple/30 hover:text-gold-300'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* MyVault Sync Badge */}
      <div className="px-6 py-4 border-t border-gold-500/20">
        <div className="bg-gold-500/10 border border-gold-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-gold-400" />
            <span className="text-xs font-medium text-gold-300">MyVault Sync</span>
          </div>
          <p className="text-xs text-equinox-light/70">Last synced: 2 min ago</p>
        </div>
      </div>

      {/* User Profile */}
      <div className="px-6 py-4 border-t border-gold-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center">
            <span className="text-equinox-darker font-bold">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-equinox-light truncate">Admin User</p>
            <p className="text-xs text-gold-300/60 truncate">premium@equinox.ai</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
