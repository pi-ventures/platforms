'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { BarChart3, TrendingUp, Zap } from 'lucide-react';
import { mockAggregateAnalytics, mockMonthlySummary, formatCurrency } from '@/lib/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const analyticsData = mockMonthlySummary.map(month => ({
    month: month.month.split(' ')[0],
    realEstate: month.realEstate / 1000000,
    investments: month.investments / 1000000,
    willAssets: month.willAssets / 1000000,
  }));

  return (
    <AppLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-5xl font-playfair font-800 text-vault-gold-light mb-2">
            Wealth Analytics
          </h1>
          <p className="text-gray-400">Advanced insights and performance metrics</p>
        </div>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="card-vault">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Net Worth Growth (YoY)</p>
            <p className="text-4xl font-playfair font-800 text-green-500">+{mockAggregateAnalytics.netWorthGrowthYoY}%</p>
            <p className="text-sm text-gray-500 mt-2">Year-over-year increase</p>
          </div>

          <div className="card-vault">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Diversification Score</p>
            <p className="text-4xl font-playfair font-800 text-vault-gold-light">{mockAggregateAnalytics.diversificationScore}/100</p>
            <p className="text-sm text-gray-500 mt-2">Well-distributed portfolio</p>
          </div>

          <div className="card-vault">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Risk Profile</p>
            <p className="text-3xl font-playfair font-800 text-vault-gold-light capitalize">{mockAggregateAnalytics.riskProfile}</p>
            <p className="text-sm text-gray-500 mt-2">Balanced approach</p>
          </div>

          <div className="card-vault">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Tax Optimization</p>
            <p className="text-4xl font-playfair font-800 text-vault-gold-light">{mockAggregateAnalytics.taxOptimizationScore}%</p>
            <p className="text-sm text-gray-500 mt-2">Optimized structure</p>
          </div>
        </div>

        {/* Asset Composition Over Time */}
        <div className="card-vault">
          <h2 className="text-2xl font-playfair font-700 text-vault-gold-light mb-6">Asset Composition Trend</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #C9A84C',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="realEstate" stackId="a" fill="#C9A84C" name="Real Estate (Cr)" />
              <Bar dataKey="investments" stackId="a" fill="#E8C96A" name="Investments (Cr)" />
              <Bar dataKey="willAssets" stackId="a" fill="#A67C3D" name="Will Assets (Cr)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div>
          <h2 className="text-2xl font-playfair font-700 text-vault-gold-light mb-6">Key Insights</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-vault">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-playfair font-700 text-vault-gold-light mb-2">Growth Trend</h3>
                  <p className="text-gray-400">Your net worth has grown consistently over the past 12 months with an average monthly increase of ₹13.58L. This represents healthy wealth accumulation.</p>
                </div>
              </div>
            </div>

            <div className="card-vault">
              <div className="flex items-start gap-3">
                <Zap className="w-6 h-6 text-vault-gold flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-playfair font-700 text-vault-gold-light mb-2">Diversification</h3>
                  <p className="text-gray-400">Your portfolio is well-diversified across real estate, investments, and liquid assets. Consider reviewing stock sector allocation for optimization.</p>
                </div>
              </div>
            </div>

            <div className="card-vault">
              <div className="flex items-start gap-3">
                <BarChart3 className="w-6 h-6 text-vault-gold-light flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-playfair font-700 text-vault-gold-light mb-2">Real Estate Performance</h3>
                  <p className="text-gray-400">Real estate comprises 56.6% of your net worth with an average ROI of 13.4%. Strong performer contributing to wealth growth.</p>
                </div>
              </div>
            </div>

            <div className="card-vault">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-6 h-6 text-vault-gold-light flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-playfair font-700 text-vault-gold-light mb-2">Investment Returns</h3>
                  <p className="text-gray-400">Your stock portfolio shows strong returns with 12.5% average gains. Keep monitoring market conditions and rebalance as needed.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
