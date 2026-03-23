'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Vault, LayoutDashboard, Building2, TrendingUp, FileText, Settings, LogOut, Zap } from 'lucide-react';
import { mockProfile } from '@/lib/mockData';
import clsx from 'clsx';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/properties', label: 'Properties', icon: Building2 },
    { href: '/portfolio', label: 'Portfolio', icon: TrendingUp },
    { href: '/legal', label: 'Legal/Wills', icon: FileText },
    { href: '/analytics', label: 'Analytics', icon: Zap },
    { href: '/settings', label: 'Sync Settings', icon: Settings },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-vault-charcoal to-vault-black border-r border-vault-gold/20 fixed left-0 top-0 flex flex-col overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-vault-gold/20">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-vault-gold to-vault-gold-light flex items-center justify-center">
            <Vault className="w-6 h-6 text-vault-black" />
          </div>
          <span className="text-xl font-playfair font-bold text-vault-gold-light">MyVault</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                active
                  ? 'bg-vault-gold/20 text-vault-gold-light border border-vault-gold/40'
                  : 'text-gray-400 hover:text-vault-gold hover:bg-vault-gold/10'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Platform Connections */}
      <div className="px-4 py-6 border-t border-vault-gold/20 space-y-3">
        <p className="text-xs font-semibold text-vault-gold uppercase tracking-widest">Connected Platforms</p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 rounded bg-vault-gold/10 border border-vault-gold/20">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-vault-gold">YesBroker</p>
              <p className="text-xs text-gray-500">Real Estate</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded bg-vault-gold/10 border border-vault-gold/20">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-vault-gold">TheEquinox.ai</p>
              <p className="text-xs text-gray-500">Portfolio</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded bg-vault-gold/10 border border-vault-gold/20">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-vault-gold">MyWills</p>
              <p className="text-xs text-gray-500">Estate</p>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-vault-gold/20">
          <div className="flex items-center gap-2 p-2 rounded bg-purple-500/10 border border-purple-500/20">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-purple-300">KnowledgeHub.ai</p>
              <p className="text-xs text-gray-500">Master Analytics</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="px-4 py-4 border-t border-vault-gold/20 space-y-3">
        <div className="p-3 rounded-lg bg-vault-gold/5 border border-vault-gold/20">
          <p className="text-sm font-semibold text-vault-gold-light">{mockProfile.name}</p>
          <p className="text-xs text-gray-500">{mockProfile.email}</p>
          <div className="mt-2 inline-block">
            <span className="badge-vault capitalize">{mockProfile.plan} Plan</span>
          </div>
        </div>

        <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:text-vault-gold hover:bg-vault-gold/10 transition-all text-sm font-medium">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
