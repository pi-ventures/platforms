'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TrendingUp, TrendingDown, ExternalLink, RefreshCw, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { mockHoldings, mockNetWorth, getTimeAgo, formatCurrency } from '@/lib/mockData';

export default function PortfolioPage() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const totalValue = mockHoldings.reduce((sum, h) => sum + h.totalValue, 0);
  const totalInvested = mockHoldings.reduce((sum, h) => sum + h.investedValue, 0);
  const totalGain = mockHoldings.reduce((sum, h) => sum + h.gain, 0);
  const gainPercent = (totalGain / totalInvested) * 100;

  const sectorData = [
    { name: 'IT Services', value: 677500, fill: '#C9A84C' },
    { name: 'Banking', value: 603500, fill: '#E8C96A' },
    { name: 'Energy', value: 142500, fill: '#A67C3D' },
  ];

  return (
    <AppLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-5xl font-playfair font-800 text-vault-gold-light mb-2">
              Investment Portfolio
            </h1>
            <p className="text-gray-400">Synced from TheEquinox.ai - Real-time stock tracking</p>
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

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="card-vault">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Portfolio Value</p>
            <p className="text-3xl font-playfair font-800 text-vault-gold-light">{formatCurrency(totalValue)}</p>
            <p className="text-sm text-gray-500 mt-2">{((totalValue / mockNetWorth.total) * 100).toFixed(1)}% of net worth</p>
          </div>

          <div className="card-vault">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Total Invested</p>
            <p className="text-3xl font-playfair font-800 text-vault-gold-light">{formatCurrency(totalInvested)}</p>
            <p className="text-sm text-gray-500 mt-2">Cost basis</p>
          </div>

          <div className="card-vault">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Total Gain</p>
            <p className="text-3xl font-playfair font-800 text-green-500">{formatCurrency(totalGain)}</p>
            <p className="text-sm text-green-500 font-semibold mt-2">+{gainPercent.toFixed(2)}%</p>
          </div>

          <div className="card-vault">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Holdings</p>
            <p className="text-3xl font-playfair font-800 text-vault-gold-light">{mockHoldings.length}</p>
            <p className="text-sm text-gray-500 mt-2">Active positions</p>
          </div>
        </div>

        {/* Sector Allocation */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="card-vault">
            <h2 className="text-xl font-playfair font-700 text-vault-gold-light mb-6">Sector Allocation</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-vault-gold/20">
              {sectorData.map((item) => (
                <div key={item.name} className="text-center">
                  <p className="text-xs text-gray-500">{item.name}</p>
                  <p className="text-sm font-semibold text-vault-gold-light mt-1">
                    {((item.value / totalValue) * 100).toFixed(0)}%
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Summary */}
          <div className="card-vault">
            <h2 className="text-xl font-playfair font-700 text-vault-gold-light mb-6">Performance Summary</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-vault-gold/10 border border-vault-gold/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Portfolio Value</span>
                  <span className="text-vault-gold-light font-bold">{formatCurrency(totalValue)}</span>
                </div>
                <p className="text-xs text-gray-500">Current market value of all holdings</p>
              </div>

              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Unrealized Gain</span>
                  <span className="text-green-500 font-bold">{formatCurrency(totalGain)}</span>
                </div>
                <p className="text-xs text-gray-500">+{gainPercent.toFixed(2)}% return on investment</p>
              </div>

              <div className="p-4 rounded-lg bg-vault-gold/10 border border-vault-gold/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Diversification Score</span>
                  <span className="text-vault-gold-light font-bold">78/100</span>
                </div>
                <p className="text-xs text-gray-500">Well-distributed across sectors</p>
              </div>

              <div className="p-4 rounded-lg bg-vault-gold/10 border border-vault-gold/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Last Sync</span>
                  <span className="text-vault-gold-light font-bold">12m ago</span>
                </div>
                <p className="text-xs text-gray-500">Real-time updates from TheEquinox.ai</p>
              </div>
            </div>
          </div>
        </div>

        {/* Holdings Table */}
        <div>
          <h2 className="text-2xl font-playfair font-700 text-vault-gold-light mb-6">Holdings</h2>
          <div className="space-y-3">
            {mockHoldings.map((holding) => (
              <div key={holding.id} className="card-vault group">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-vault-gold/20 to-vault-gold-light/20 flex items-center justify-center font-bold text-vault-gold text-sm group-hover:from-vault-gold/30 group-hover:to-vault-gold-light/30 transition-all">
                        {holding.symbol.substring(0, 1)}
                      </div>
                      <div>
                        <p className="font-semibold text-vault-gold-light">{holding.symbol}</p>
                        <p className="text-xs text-gray-500">{holding.name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right pr-4">
                    <p className="text-lg font-playfair font-700 text-vault-gold-light">
                      {formatCurrency(holding.totalValue)}
                    </p>
                    <p className="text-xs text-gray-500">{holding.quantity} shares</p>
                  </div>

                  <div className="text-right pr-4">
                    <p className={`font-semibold flex items-center justify-end gap-1 ${
                      holding.gainPercent >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {holding.gainPercent >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {holding.gainPercent >= 0 ? '+' : ''}{holding.gainPercent.toFixed(2)}%
                    </p>
                    <p className={`text-xs ${holding.gainPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {holding.gainPercent >= 0 ? '+' : ''}{formatCurrency(holding.gain)}
                    </p>
                  </div>

                  <a
                    href="#"
                    className="ml-4 p-2 rounded-lg hover:bg-vault-gold/10 text-vault-gold hover:text-vault-gold-light transition-colors flex-shrink-0"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TheEquinox Integration Info */}
        <div className="card-vault-premium border-2 border-vault-gold/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-vault-gold/20 to-vault-gold-light/20 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-vault-gold-light" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-playfair font-700 text-vault-gold-light mb-2">TheEquinox.ai Integration</h3>
              <p className="text-gray-400 mb-4">
                Your portfolio is continuously synced with TheEquinox.ai. Real-time price updates, P&L calculations, and market analysis are automatically included.
              </p>
              <div className="flex gap-4">
                <button className="btn-vault text-sm">Open TheEquinox.ai</button>
                <button className="btn-vault-outline text-sm">View Full Analysis</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
