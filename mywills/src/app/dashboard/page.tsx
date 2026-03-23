'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Home,
  DollarSign,
  Users,
  FileCheck,
  Plus,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Shield,
  Calendar,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Link from 'next/link';
import {
  testator,
  familyMembers,
  assets,
  estateStats,
  will,
  recentActivity,
  myVaultSync,
} from '@/lib/mockData';

const Dashboard = () => {
  const [syncStatus] = useState(myVaultSync);

  // Prepare data for pie chart
  const pieData = assets.map((asset) => ({
    name: asset.name,
    value: asset.value,
  }));

  const COLORS = ['#1A2744', '#C9A84C', '#2D5016', '#4A6FA5', '#F8F6F0', '#D4CEBC'];

  const quickActions = [
    { icon: FileCheck, label: 'Update Will', color: 'bg-legal-gold' },
    { icon: Plus, label: 'Add Asset', color: 'bg-legal-green' },
    { icon: Users, label: 'Add Family', color: 'bg-legal-accent' },
    { icon: Shield, label: 'Get Legal Review', color: 'bg-legal-primary' },
  ];

  const legalHeirs = familyMembers.filter((m) => m.isLegalHeir);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-header font-bold text-legal-primary mb-2">
          Welcome, {testator.name}
        </h1>
        <p className="text-legal-primary opacity-75">
          Manage your estate, assets, and legacy
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="card-legal">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-legal-primary opacity-75 mb-1">Total Assets Value</p>
              <p className="text-3xl font-header font-bold text-legal-gold">
                ₹{(estateStats.totalValue / 10000000).toFixed(2)}Cr
              </p>
            </div>
            <div className="w-12 h-12 bg-legal-gold bg-opacity-20 rounded-legal flex items-center justify-center">
              <TrendingUp className="text-legal-gold" />
            </div>
          </div>
        </div>

        <div className="card-legal">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-legal-primary opacity-75 mb-1">Total Assets</p>
              <p className="text-3xl font-header font-bold text-legal-primary">
                {estateStats.totalAssets}
              </p>
              <p className="text-xs text-legal-primary opacity-75 mt-1">
                {estateStats.properties} Properties
              </p>
            </div>
            <div className="w-12 h-12 bg-legal-primary bg-opacity-20 rounded-legal flex items-center justify-center">
              <Home className="text-legal-primary" />
            </div>
          </div>
        </div>

        <div className="card-legal">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-legal-primary opacity-75 mb-1">Will Status</p>
              <p className="text-3xl font-header font-bold text-legal-green capitalize">
                {will.status}
              </p>
              <p className="text-xs text-legal-primary opacity-75 mt-1">
                {will.assets.length} assets covered
              </p>
            </div>
            <div className="w-12 h-12 bg-legal-green bg-opacity-20 rounded-legal flex items-center justify-center">
              <FileCheck className="text-legal-green" />
            </div>
          </div>
        </div>

        <div className="card-legal">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-legal-primary opacity-75 mb-1">Family Members</p>
              <p className="text-3xl font-header font-bold text-legal-accent">
                {familyMembers.length}
              </p>
              <p className="text-xs text-legal-primary opacity-75 mt-1">
                {legalHeirs.length} legal heirs
              </p>
            </div>
            <div className="w-12 h-12 bg-legal-accent bg-opacity-20 rounded-legal flex items-center justify-center">
              <Users className="text-legal-accent" />
            </div>
          </div>
        </div>
      </div>

      {/* MyVault Sync Status */}
      <div className="mb-8 card-legal bg-legal-green bg-opacity-5 border-2 border-legal-green border-opacity-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-legal-green bg-opacity-20 rounded-legal flex items-center justify-center seal-active">
              <RefreshCw className="text-legal-green" size={24} />
            </div>
            <div>
              <p className="font-semibold text-legal-primary">MyVault Synchronization Active</p>
              <p className="text-sm text-legal-primary opacity-75">
                Your data is synced with MyVault and legalopinion.co.in
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-600" size={20} />
            <span className="text-sm font-semibold text-green-600">Synced</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Asset Breakdown Chart */}
        <div className="lg:col-span-1 card-legal">
          <h3 className="text-xl font-header font-bold text-legal-primary mb-6">
            Asset Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `₹${(value / 1000000).toFixed(1)}L`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Family Members */}
        <div className="lg:col-span-2 card-legal">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-header font-bold text-legal-primary">
              Family Members & Heirs
            </h3>
            <Link href="/family" className="btn-legal-outline text-sm">
              Manage
            </Link>
          </div>
          <div className="space-y-3">
            {legalHeirs.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 bg-legal-cream rounded-legal border border-legal-border hover:shadow-legal transition-shadow">
                <div>
                  <p className="font-semibold text-legal-primary">{member.name}</p>
                  <p className="text-sm text-legal-primary opacity-75 capitalize">
                    {member.role}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-legal-gold">{member.sharePercentage}%</p>
                    <p className="text-xs text-legal-primary opacity-75">Share</p>
                  </div>
                  <div className="badge-legal">
                    Legal Heir
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Will Coverage */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 card-legal">
          <h3 className="text-xl font-header font-bold text-legal-primary mb-6">
            Will Asset Coverage
          </h3>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-legal-primary opacity-75">
                Assets covered in will
              </p>
              <p className="font-semibold text-legal-primary">
                {will.assets.length} of {estateStats.totalAssets}
              </p>
            </div>
            <div className="w-full h-3 bg-legal-light rounded-full overflow-hidden">
              <div
                className="h-full bg-legal-gold transition-all duration-300"
                style={{
                  width: `${(will.assets.length / estateStats.totalAssets) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs text-legal-primary opacity-75 mt-2">
              {will.assets.length === estateStats.totalAssets
                ? 'All assets are covered in your will'
                : `${estateStats.totalAssets - will.assets.length} assets not yet included`}
            </p>
          </div>
        </div>

        <div className="card-legal bg-legal-accent bg-opacity-5 border-2 border-legal-accent border-opacity-30">
          <div className="flex items-start gap-3">
            <Shield className="text-legal-accent mt-1" size={20} />
            <div>
              <p className="font-semibold text-legal-primary mb-1">Will Status</p>
              <p className="text-sm text-legal-primary opacity-75 mb-3">
                Your will is active and court-admissible
              </p>
              <div className="flex items-center gap-2 text-xs text-legal-primary opacity-75">
                <Calendar size={14} />
                <span>Signed: {will.signedAt}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-xl font-header font-bold text-legal-primary mb-4">
          Quick Actions
        </h3>
        <div className="grid md:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                className={`${action.color} text-legal-primary hover:shadow-legal-lg transition-all py-6 rounded-legal font-semibold flex flex-col items-center gap-2`}
              >
                <Icon size={28} />
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card-legal">
        <h3 className="text-xl font-header font-bold text-legal-primary mb-6">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-4 bg-legal-cream rounded-legal border border-legal-border hover:shadow-legal transition-shadow"
            >
              <div className="w-10 h-10 bg-legal-gold bg-opacity-20 rounded-legal flex items-center justify-center flex-shrink-0 mt-0.5">
                {activity.icon === 'CheckCircle' && (
                  <CheckCircle className="text-legal-gold" size={20} />
                )}
                {activity.icon === 'Plus' && (
                  <Plus className="text-legal-gold" size={20} />
                )}
                {activity.icon === 'Users' && (
                  <Users className="text-legal-gold" size={20} />
                )}
                {activity.icon === 'RefreshCw' && (
                  <RefreshCw className="text-legal-gold" size={20} />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-legal-primary">{activity.title}</p>
                <p className="text-sm text-legal-primary opacity-75 mt-1">
                  {activity.description}
                </p>
                <p className="text-xs text-legal-primary opacity-50 mt-2">
                  {new Date(activity.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
