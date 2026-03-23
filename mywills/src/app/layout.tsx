import type { Metadata } from 'next';
import './globals.css';
import AppLayout from '@/components/layout/AppLayout';

export const metadata: Metadata = {
  title: 'MyWills - Legal Will & Estate Management Platform',
  description: 'Secure your legacy. Create, manage, and maintain your legal will with professional guidance from legal experts.',
  keywords: ['will', 'estate planning', 'legal documents', 'inheritance', 'testament'],
  openGraph: {
    title: 'MyWills - Secure Your Legacy',
    description: 'Create and manage your legal will with professional guidance',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
