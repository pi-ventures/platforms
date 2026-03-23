'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TrendingUp, TrendingDown, RefreshCw, BarChart3, Zap, Lock } from 'lucide-react';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  mockProfile,
  mockNetWorth,
  mockMonthlySummary,
  mockProperties,
  mockHoldings,
  mockBeneficiaries,
  getTimeAgo,
  formatCurrency,
} from '@/lib/mockData';

export default function DashboardPage() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const netWorthData = [
    { name: 'Real Estate', value: mockNetWorth.realEstate, fill: '#C9A84C' },
    { name: 'Investments', value: mockNetWorth.investments, fill: '#E8C96A' },
    { name: 'Will Assets', value: mockNetWorth.willAssets, fill: '#A67C3D' },
    { name: 'Cash', value: mockNetWorth.cash, fill: '#D4AF37' },
  ];

  const dayChange = mockNetWorth.total * 0.0015; // Estimated daily change
  const monthChange = 50000; // From mock data
  const dayChangePercent = (dayChange / mockNetWorth.total) * 100;
  const monthChangePercent = (monthChange / mockNetWorth.total) * 100;

  return (
    <AppLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-5xl font-playfair font-800 text-vault-gold-light mb-2">
              Your Wealth Vault
            </h1>
            <p className="text-gray-400">Complete overview of your financial universe</p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-3 rounded-lg bg-vault-charcoal border border-vault-gold/30 text-vault-gold hover:border-vault-gold/60 transition-all"
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>

        {/* Total Net Worth Hero */}
        <div className="card-vault-premium">
          <p className="text-gray-400 uppercase tracking-widest text-xs font-semibold mb-4">Total Net Worth</p>
          <div className="flex items-baseline gap-4 mb-6">
            <h2 className="text-6xl font-playfair font-800 text-vault-gold-light">
              {formatCurrency(mockNetWorth.total)}
            </h2>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-green-500 font-semibold">+{formatCurrency(monthChange)}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className="text-gray-500 text-sm mb-2">Month Change</p>
              <p className="text-2xl font-playfair font-700 text-vault-gold">
                +{formatCurrency(monthChange)}
              </p>
              <p className="text-sm text-green-500 font-medium">+{monthChangePercent.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-2">Day Change</p>
              <p className="text-2xl font-playfair font-700 text-vault-gold">
                +{formatCurrency(dayChange)}
              </p>
              <p className="text-sm text-green-500 font-medium">+{dayChangePercent.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-2">Last Sync</p>
              <p className="text-2xl font-playfair font-700 text-vault-gold">
                {getTimeAgo(mockProfile.syncSources[0].lastSync)}
              </p>
              <p className="text-sm text-vault-gold-light font-medium">Real-time sync enabled</p>
            </div>
          </div>
        </div>

        {/* Sync Status Cards */}
        <div>
          <h3 className="text-2xl font-playfair font-700 text-vault-gold-light mb-4">Connected Platforms</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {/* YesBroker */}
            <div className="card-vault">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-playfair font-700 text-vault-gold-light">YesBroker</h4>
                  <p className="text-gray-500 text-sm">Real Estate Properties</p>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/40">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs font-medium text-green-400">Connected</span>
                </div>
              </div>

              <div className="space-y-3 mb-4 pb-4 border-b border-vault-gold/20">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Properties</span>
                  <span className="text-vault-gold font-semibold">{mockProperties.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Total Value</span>
                  <span className="text-vault-gold-light font-semibold">{formatCurrency(mockNetWorth.realEstate)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Last sync {getTimeAgo(mockProfile.syncSources[0].lastSync)}</span>
                <button className="text-vault-gold hover:text-vault-gold-light transition-colors font-medium">
                  View →
                </button>
              </div>
            </div>

            {/* TheEquinox.ai */}
            <div className="card-vault">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-playfair font-700 text-vault-gold-light">TheEquinox.ai</h4>
                  <p className="text-gray-500 text-sm">Investment Portfolio</p>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/40">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs font-medium text-green-400">Connected</span>
                </div>
              </div>

              <div className="space-y-3 mb-4 pb-4 border-b border-vault-gold/20">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Holdings</span>
                  <span className="text-vault-gold font-semibold">{mockHoldings.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Portfolio Value</span>
                  <span className="text-vault-gold-light font-semibold">{formatCurrency(mockNetWorth.investments)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Last sync {getTimeAgo(mockProfile.syncSources[1].lastSync)}</span>
                <button className="text-vault-gold hover:text-vault-gold-light transition-colors font-medium">
                  View →
                </button>
              </div>
            </div>

            {/* MyWills */}
            <div className="card-vault">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-playfair font-700 text-vault-gold-light">MyWills (iWills)</h4>
                  <p className="text-gray-500 text-sm">Estate & Legal Documents</p>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/40">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs font-medium text-green-400">Connected</span>
                </div>
              </div>

              <div className="space-y-3 mb-4 pb-4 border-b border-vault-gold/20">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Estate Assets</span>
                  <span className="text-vault-gold font-semibold">{formatCurrency(mockNetWorth.willAssets)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Beneficiaries</span>
                  <span className="text-vault-gold font-semibold">{mockBeneficiaries.length}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Last sync {getTimeAgo(mockProfile.syncSources[2].lastSync)}</span>
                <button className="text-vault-gold hover:text-vault-gold-light transition-colors font-medium">
                  View →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Net Worth Breakdown */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="card-vault">
            <h3 className="text-xl font-playfair font-700 text-vault-gold-light mb-6">Net Worth Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={netWorthData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {netWorthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A1A',
                    border: '1px solid #C9A84C',
                    borderRadius: '8px',
                  }}
                  formatter={(value: any) => formatCurrency(value)}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-vault-gold/20">
              {netWorthData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
                  <div>
                    <p className="text-xs text-gray-500">{item.name}</p>
                    <p className="text-sm font-semibold text-vault-gold-light">
                      {formatCurrency(item.value)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Net Worth Trend */}
          <div className="card-vault">
            <h3 className="text-xl font-playfair font-700 text-vault-gold-light mb-6">12-Month Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockMonthlySummary}>
                <defs>
                  <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#999" style={{ fontSize: '12px' }} />
                <YAxis stroke="#999" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A1A',
                    border: '1px solid #C9A84C',
                    borderRadius: '8px',
                  }}
                  formatter={(value: any) => formatCurrency(value)}
                />
                <Area
                  type="monotone"
                  dataKey="netWorth"
                  stroke="#E8C96A"
                  fillOpacity={1}
                  fill="url(#colorNetWorth)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Wealth Highlights */}
        <div>
          <h3 className="text-2xl font-playfair font-700 text-vault-gold-light mb-4">Wealth Highlights</h3>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Top Properties */}
            <div className="card-vault">
              <h4 className="text-lg font-playfair font-700 text-vault-gold-light mb-4">Top Properties</h4>
              <div className="space-y-3">
                {mockProperties.slice(0, 3).map((property, index) => (
                  <div key={property.id} className="pb-3 border-b border-vault-gold/20 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-sm font-medium text-gray-300">{index + 1}. {property.address.split('-')[1]}</span>
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">{property.status}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-vault-gold-light font-semibold">{formatCurrency(property.value)}</span>
                      <span className="text-xs text-green-500">+{property.roi}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Holdings */}
            <div className="card-vault">
              <h4 className="text-lg font-playfair font-700 text-vault-gold-light mb-4">Top Holdings</h4>
              <div className="space-y-3">
                {mockHoldings.slice(0, 3).map((holding, index) => (
                  <div key={holding.id} className="pb-3 border-b border-vault-gold/20 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-sm font-medium text-gray-300">{index + 1}. {holding.symbol}</span>
                      <span className={`text-xs font-semibold ${holding.gainPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {holding.gainPercent >= 0 ? '+' : ''}{holding.gainPercent.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-vault-gold-light font-semibold">{formatCurrency(holding.totalValue)}</span>
                      <span className={`text-xs ${holding.gainPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {holding.gainPercent >= 0 ? '+' : ''}{formatCurrency(holding.gain)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Will Coverage */}
            <div className="card-vault">
              <h4 className="text-lg font-playfair font-700 text-vault-gold-light mb-4">Estate Summary</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Coverage</span>
                    <span className="text-vault-gold font-semibold">95%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-vault-gold/20 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-vault-gold to-vault-gold-light" style={{ width: '95%' }}></div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-vault-gold/10 border border-vault-gold/20">
                  <p className="text-xs text-gray-500 mb-1">Estate Assets Covered</p>
                  <p className="text-lg font-playfair font-700 text-vault-gold-light">
                    {formatCurrency(mockNetWorth.willAssets)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-vault-gold/10 border border-vault-gold/20">
                  <p className="text-xs text-gray-500 mb-1">Beneficiaries</p>
                  <p className="text-lg font-playfair font-700 text-vault-gold-light">
                    {mockBeneficiaries.length} people
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KnowledgeHub.ai Integration */}
        <div className="card-vault-premium border-2 border-purple-500/40 bg-gradient-to-r from-purple-500/5 to-vault-charcoal">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-purple-400" />
                <h3 className="text-2xl font-playfair font-700 text-purple-300">Master Analytics</h3>
              </div>
              <p className="text-gray-400 mb-6">
                Your complete wealth data is being synchronized to KnowledgeHub.ai for advanced AI-powered insights and recommendations.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <p className="text-xs text-purple-300 font-semibold mb-1">Total Assets</p>
                  <p className="text-lg font-playfair font-700 text-purple-200">{formatCurrency(mockNetWorth.total)}</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <p className="text-xs text-purple-300 font-semibold mb-1">Growth (YoY)</p>
                  <p className="text-lg font-playfair font-700 text-purple-200">+8.8%</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <p className="text-xs text-purple-300 font-semibold mb-1">Diversification</p>
                  <p className="text-lg font-playfair font-700 text-purple-200">82/100</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <p className="text-xs text-purple-300 font-semibold mb-1">Risk Profile</p>
                  <p className="text-lg font-playfair font-700 text-purple-200">Moderate</p>
                </div>
              </div>
            </div>
            <Lock className="w-12 h-12 text-purple-400/30 flex-shrink-0" />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
