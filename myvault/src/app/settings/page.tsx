'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Settings, RefreshCw, Shield, Bell, Clock, ToggleRight } from 'lucide-react';
import { mockProfile, getTimeAgo } from '@/lib/mockData';

export default function SettingsPage() {
  const [syncAutomation, setSyncAutomation] = useState(true);
  const [syncNotifications, setSyncNotifications] = useState(true);

  return (
    <AppLayout>
      <div className="p-8 space-y-8 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-5xl font-playfair font-800 text-vault-gold-light mb-2">
            Sync Settings
          </h1>
          <p className="text-gray-400">Manage your data synchronization preferences</p>
        </div>

        {/* Platform Connections */}
        <div>
          <h2 className="text-2xl font-playfair font-700 text-vault-gold-light mb-6">Platform Connections</h2>
          <div className="space-y-4">
            {mockProfile.syncSources.map((source) => (
              <div key={source.id} className="card-vault">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-playfair font-700 text-vault-gold-light">{source.name}</h3>
                      <span className="badge-vault-success text-xs">Connected</span>
                    </div>
                    <p className="text-gray-400 mb-3">{source.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Status</p>
                        <p className="font-semibold text-green-400">Active & Syncing</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Last Sync</p>
                        <p className="font-semibold text-vault-gold-light">{getTimeAgo(source.lastSync)}</p>
                      </div>
                    </div>
                  </div>

                  <button className="px-4 py-2 rounded-lg bg-vault-charcoal border border-vault-gold/30 text-vault-gold hover:border-vault-gold/60 transition-all text-sm font-medium">
                    Configure
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sync Preferences */}
        <div>
          <h2 className="text-2xl font-playfair font-700 text-vault-gold-light mb-6">Sync Preferences</h2>
          <div className="space-y-4">
            {/* Auto Sync */}
            <div className="card-vault">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-playfair font-700 text-vault-gold-light mb-2">Automatic Sync</h3>
                  <p className="text-gray-400">Data from all platforms is synchronized automatically in real-time</p>
                </div>
                <button
                  onClick={() => setSyncAutomation(!syncAutomation)}
                  className={`p-2 rounded-lg transition-all ${
                    syncAutomation ? 'bg-green-500/20 text-green-500' : 'bg-vault-gold/10 text-vault-gold'
                  }`}
                >
                  <ToggleRight className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Sync Frequency */}
            <div className="card-vault">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-playfair font-700 text-vault-gold-light flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5" />
                    Sync Frequency
                  </h3>
                  <p className="text-gray-400">How often to sync data from connected platforms</p>
                </div>
              </div>
              <div className="space-y-2">
                {['Real-time', 'Every 15 minutes', 'Every 1 hour', 'Every 6 hours', 'Daily'].map((option) => (
                  <label key={option} className="flex items-center gap-3 p-2 rounded hover:bg-vault-gold/5 cursor-pointer">
                    <input
                      type="radio"
                      name="frequency"
                      defaultChecked={option === 'Real-time'}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-300">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="card-vault">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-playfair font-700 text-vault-gold-light flex items-center gap-2 mb-2">
                    <Bell className="w-5 h-5" />
                    Sync Notifications
                  </h3>
                  <p className="text-gray-400">Get notified when sync completes or encounters issues</p>
                </div>
                <button
                  onClick={() => setSyncNotifications(!syncNotifications)}
                  className={`p-2 rounded-lg transition-all ${
                    syncNotifications ? 'bg-green-500/20 text-green-500' : 'bg-vault-gold/10 text-vault-gold'
                  }`}
                >
                  <ToggleRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Data Security */}
        <div>
          <h2 className="text-2xl font-playfair font-700 text-vault-gold-light mb-6">Data Security</h2>
          <div className="card-vault">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-green-500 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-playfair font-700 text-vault-gold-light mb-2">Encryption Status</h3>
                <p className="text-gray-400 mb-4">All your data is encrypted with 256-bit AES encryption in transit and at rest.</p>
                <div className="space-y-2 text-sm">
                  <p><span className="text-green-400">✓</span> End-to-end encryption enabled</p>
                  <p><span className="text-green-400">✓</span> Data isolation per user</p>
                  <p><span className="text-green-400">✓</span> Regular security audits</p>
                  <p><span className="text-green-400">✓</span> Compliance: GDPR, ISO 27001</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* API Access */}
        <div>
          <h2 className="text-2xl font-playfair font-700 text-vault-gold-light mb-6">API Access</h2>
          <div className="card-vault">
            <h3 className="font-playfair font-700 text-vault-gold-light mb-4">KnowledgeHub.ai Integration</h3>
            <p className="text-gray-400 mb-4">Your aggregated analytics are automatically sent to KnowledgeHub.ai for advanced insights.</p>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <span className="text-gray-300">Status</span>
                <span className="badge-vault-success">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-vault-gold/10 border border-vault-gold/20">
                <span className="text-gray-300">Last Sync</span>
                <span className="text-vault-gold-light">5 minutes ago</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-vault-gold/10 border border-vault-gold/20">
                <span className="text-gray-300">Data Sent</span>
                <span className="text-vault-gold-light">Profile, Net Worth, Analytics</span>
              </div>
            </div>

            <button className="btn-vault-outline text-sm">View API Documentation</button>
          </div>
        </div>

        {/* Advanced Options */}
        <div>
          <h2 className="text-2xl font-playfair font-700 text-vault-gold-light mb-6">Advanced Options</h2>
          <div className="space-y-4">
            <button className="w-full card-vault text-left hover:shadow-gold flex items-center justify-between">
              <span className="text-gray-300 font-medium">Re-sync All Data</span>
              <RefreshCw className="w-5 h-5 text-vault-gold" />
            </button>

            <button className="w-full card-vault text-left hover:shadow-gold flex items-center justify-between">
              <span className="text-gray-300 font-medium">Export Data</span>
              <Settings className="w-5 h-5 text-vault-gold" />
            </button>

            <button className="w-full card-vault text-left hover:shadow-gold border-red-500/30 flex items-center justify-between">
              <span className="text-red-400 font-medium">Disconnect All Platforms</span>
              <Shield className="w-5 h-5 text-red-500" />
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
