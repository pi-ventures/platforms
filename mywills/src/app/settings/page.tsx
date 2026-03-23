'use client';

import React, { useState } from 'react';
import { Bell, Lock, Eye, Users, Download, Trash2, LogOut, Save, X } from 'lucide-react';
import { testator } from '@/lib/mockData';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [isSaved, setIsSaved] = useState(false);

  const tabs = [
    { id: 'account', label: 'Account', icon: Users },
    { id: 'privacy', label: 'Privacy & Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Data & Export', icon: Download },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-header font-bold text-legal-primary mb-2">
          Settings
        </h1>
        <p className="text-legal-primary opacity-75">
          Manage your account and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-legal-border mb-8 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-legal-gold text-legal-gold font-semibold'
                  : 'border-transparent text-legal-primary opacity-75 hover:opacity-100'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Account Settings */}
      {activeTab === 'account' && (
        <div className="space-y-6">
          <div className="card-legal">
            <h2 className="text-xl font-header font-bold text-legal-primary mb-6">
              Personal Information
            </h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-legal-primary mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={testator.name}
                    className="w-full px-4 py-2 border border-legal-border rounded-legal focus:border-legal-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-legal-primary mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={testator.email}
                    className="w-full px-4 py-2 border border-legal-border rounded-legal focus:border-legal-gold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-legal-primary mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  defaultValue={testator.phone}
                  className="w-full px-4 py-2 border border-legal-border rounded-legal focus:border-legal-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-legal-primary mb-2">
                  Address
                </label>
                <textarea
                  defaultValue={testator.address}
                  rows={3}
                  className="w-full px-4 py-2 border border-legal-border rounded-legal focus:border-legal-gold"
                />
              </div>
              <button
                onClick={() => setIsSaved(true)}
                className="btn-legal-primary flex items-center gap-2"
              >
                <Save size={18} />
                Save Changes
              </button>
              {isSaved && (
                <div className="p-3 bg-legal-green bg-opacity-10 border border-legal-green rounded-legal text-legal-green text-sm font-semibold">
                  Changes saved successfully
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Privacy & Security */}
      {activeTab === 'privacy' && (
        <div className="space-y-6">
          <div className="card-legal">
            <h2 className="text-xl font-header font-bold text-legal-primary mb-6">
              Password & Security
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-legal-primary mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-legal-border rounded-legal focus:border-legal-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-legal-primary mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-legal-border rounded-legal focus:border-legal-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-legal-primary mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-legal-border rounded-legal focus:border-legal-gold"
                />
              </div>
              <button className="btn-legal-primary flex items-center gap-2">
                <Lock size={18} />
                Update Password
              </button>
            </div>
          </div>

          <div className="card-legal border-2 border-legal-green border-opacity-30">
            <div className="flex items-start gap-4">
              <Lock className="text-legal-green flex-shrink-0" size={24} />
              <div>
                <h3 className="font-semibold text-legal-primary mb-2">Two-Factor Authentication</h3>
                <p className="text-sm text-legal-primary opacity-75 mb-4">
                  Add an extra layer of security to your account
                </p>
                <button className="btn-legal-secondary">Enable 2FA</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <div className="card-legal">
          <h2 className="text-xl font-header font-bold text-legal-primary mb-6">
            Notification Preferences
          </h2>
          <div className="space-y-4">
            {[
              {
                title: 'Will Updates',
                description: 'Get notified when your will is updated or reviewed',
              },
              {
                title: 'Asset Changes',
                description: 'Receive alerts when assets are added or modified',
              },
              {
                title: 'Legal Reminders',
                description: 'Reminders for will review and updates',
              },
              {
                title: 'MyVault Sync Status',
                description: 'Notifications about synchronization status',
              },
            ].map((notification, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border border-legal-border rounded-legal">
                <div>
                  <p className="font-semibold text-legal-primary">{notification.title}</p>
                  <p className="text-sm text-legal-primary opacity-75">
                    {notification.description}
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
            ))}
            <button className="btn-legal-primary flex items-center gap-2">
              <Save size={18} />
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* Data & Export */}
      {activeTab === 'data' && (
        <div className="space-y-6">
          <div className="card-legal">
            <h2 className="text-xl font-header font-bold text-legal-primary mb-6">
              Export Your Data
            </h2>
            <p className="text-legal-primary opacity-75 mb-4">
              Download a copy of all your data in a portable format
            </p>
            <button className="btn-legal-primary flex items-center gap-2">
              <Download size={18} />
              Export All Data (ZIP)
            </button>
          </div>

          <div className="card-legal bg-legal-primary bg-opacity-5 border-2 border-legal-primary border-opacity-30">
            <div className="flex items-start gap-4">
              <Trash2 className="text-legal-primary flex-shrink-0" size={24} />
              <div className="flex-1">
                <h3 className="font-semibold text-legal-primary mb-2">Delete Account</h3>
                <p className="text-sm text-legal-primary opacity-75 mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <button className="btn-legal-outline text-red-600 border-red-600 hover:bg-red-50">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
