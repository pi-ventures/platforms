'use client';

import Sidebar from './Sidebar';
import { Toaster } from 'react-hot-toast';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-equinox-darker">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1E1040',
            color: '#F5F0E8',
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '8px',
          },
        }}
      />
    </div>
  );
}
