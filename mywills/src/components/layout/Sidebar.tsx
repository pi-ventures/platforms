'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Package,
  Family,
  Files,
  Gavel,
  Settings,
  Scale,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/will', label: 'My Will', icon: FileText },
    { href: '/assets', label: 'Assets', icon: Package },
    { href: '/family', label: 'Family Tree', icon: Family },
    { href: '/documents', label: 'Documents', icon: Files },
    { href: '/legal-review', label: 'Legal Review', icon: Gavel },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href);

  return (
    <aside className="w-72 bg-legal-primary text-legal-cream h-screen sticky top-0 overflow-y-auto shadow-legal-lg">
      {/* Logo Section */}
      <div className="p-6 border-b border-legal-green border-opacity-20">
        <Link href="/" className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 bg-legal-gold rounded-lg">
            <Scale size={24} className="text-legal-primary" />
          </div>
          <h1 className="text-2xl font-header font-bold text-legal-gold">My Wills</h1>
        </Link>
        <p className="text-xs text-legal-light opacity-75">Legal Estate Management</p>
      </div>

      {/* Navigation */}
      <nav className="px-4 py-6">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-legal transition-all duration-200',
                    active
                      ? 'bg-legal-gold text-legal-primary font-semibold shadow-legal-accent'
                      : 'text-legal-light hover:bg-legal-accent hover:bg-opacity-20'
                  )}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* MyVault Sync Section */}
      <div className="px-4 py-4 border-t border-legal-green border-opacity-20 mx-4 rounded-legal bg-legal-green bg-opacity-10">
        <div className="flex items-center gap-2 mb-2">
          <RefreshCw size={16} className="text-legal-gold" />
          <p className="text-sm font-semibold text-legal-gold">Sync Status</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-legal-light">
          <CheckCircle size={14} className="text-green-400" />
          <span>Synced with MyVault</span>
        </div>
        <p className="text-xs text-legal-light opacity-75 mt-1">
          Last sync: Just now
        </p>
      </div>

      {/* Footer - Legal Partner */}
      <div className="px-4 py-6 border-t border-legal-green border-opacity-20 mt-auto">
        <div className="bg-legal-green bg-opacity-20 rounded-legal p-4">
          <p className="text-xs text-legal-light mb-2">
            Legal Partner
          </p>
          <Link
            href="https://www.legalopinion.co.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-legal-gold hover:text-legal-cream transition-colors"
          >
            <Gavel size={14} />
            <span className="text-xs font-semibold">legalopinion.co.in</span>
          </Link>
          <p className="text-xs text-legal-light opacity-75 mt-2">
            Professional legal guidance for your estate
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
