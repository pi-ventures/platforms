'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Zap,
  Eye,
  EyeOff,
  Clock,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { portfolio, autoTradeRules, recentTrades, marketIndices, portfolioMetrics } from '@/lib/mockData';

const COLORS = ['#C9A84C', '#2D1B69', '#E8C96A', '#1E1040', '#92650f'];

export default function DashboardPage() {
  const [showValue, setShowValue] = useState(true);

  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
    return `₹${value.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-equinox-light mb-2">
            Portfolio Dashboard
          </h1>
          <p className="text-equinox-light/60">Real-time market data and portfolio analytics</p>
        </div>
        <button
          onClick={() => setShowValue(!showValue)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gold-500/30 hover:border-gold-500/60 text-gold-300 transition-all"
        >
          {showValue ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          {showValue ? 'Hide' : 'Show'} Values
        </button>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        {/* Total Value */}
        <div className="metric-card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gold-300 text-sm font-medium mb-1">Portfolio Value</p>
              <p className="text-3xl font-display font-bold text-equinox-light">
                {showValue ? formatCurrency(portfolio.totalValue) : '••••'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-gold-gradient/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-gold-400" />
            </div>
          </div>
          <p className="text-xs text-equinox-light/60">Total portfolio value</p>
        </div>

        {/* Day P&L */}
        <div className="metric-card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gold-300 text-sm font-medium mb-1">Today's P&L</p>
              <p className={`text-3xl font-display font-bold ${portfolio.dayPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {showValue ? formatCurrency(Math.abs(portfolio.dayPnL)) : '••••'}
              </p>
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${portfolio.dayPnL >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
              {portfolio.dayPnL >= 0 ? (
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
            </div>
          </div>
          <p className={`text-xs ${portfolio.dayPnLPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {portfolio.dayPnLPercent >= 0 ? '+' : ''}{portfolio.dayPnLPercent.toFixed(2)}%
          </p>
        </div>

        {/* Total P&L */}
        <div className="metric-card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gold-300 text-sm font-medium mb-1">Total P&L</p>
              <p className="text-3xl font-display font-bold text-emerald-400">
                {showValue ? formatCurrency(portfolio.totalPnL) : '••••'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <p className="text-xs text-emerald-400">+{portfolio.totalPnLPercent.toFixed(1)}%</p>
        </div>

        {/* Active Rules */}
        <div className="metric-card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gold-300 text-sm font-medium mb-1">Active Rules</p>
              <p className="text-3xl font-display font-bold text-equinox-light">
                {autoTradeRules.filter(r => r.active).length}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <p className="text-xs text-equinox-light/60">Auto-trading rules</p>
        </div>
      </div>

      {/* Portfolio Performance Chart */}
      <div className="card-dark">
        <h2 className="text-lg font-semibold text-equinox-light mb-6">Portfolio Performance (12 Months)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={portfolioMetrics}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.1)" />
            <XAxis dataKey="date" stroke="#F5F0E8" />
            <YAxis stroke="#F5F0E8" />
            <Tooltip
              contentStyle={{
                background: '#1E1040',
                border: '1px solid rgba(201,168,76,0.3)',
                borderRadius: '8px',
              }}
              formatter={(value) => [formatCurrency(value), '']}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#C9A84C"
              fillOpacity={1}
              fill="url(#colorValue)"
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Top Holdings and Auto Rules */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Top Holdings */}
        <div className="card-dark">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-equinox-light">Top Holdings</h2>
            <a href="/portfolio" className="text-gold-400 hover:text-gold-300 text-sm font-medium">
              View All
            </a>
          </div>
          <div className="space-y-4">
            {portfolio.holdings.slice(0, 5).map((holding) => (
              <div key={holding.symbol} className="flex items-center justify-between p-3 rounded-lg bg-equinox-purple/20 hover:bg-equinox-purple/40 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-equinox-light">{holding.symbol}</p>
                  <p className="text-xs text-equinox-light/60">{holding.name}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${holding.pnlPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {holding.pnlPercent >= 0 ? '+' : ''}{holding.pnlPercent.toFixed(2)}%
                  </p>
                  <p className="text-xs text-equinox-light/60">{holding.qty} shares</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Auto Trading Rules */}
        <div className="card-dark">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-equinox-light">Auto Trading Rules</h2>
            <a href="/trading" className="text-gold-400 hover:text-gold-300 text-sm font-medium">
              Manage
            </a>
          </div>
          <div className="space-y-4">
            {autoTradeRules.slice(0, 5).map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-3 rounded-lg bg-equinox-purple/20">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-equinox-light text-sm">{rule.name}</p>
                    {rule.active ? (
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                    )}
                  </div>
                  <p className="text-xs text-equinox-light/60">{rule.condition}</p>
                </div>
                <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ml-2">
                  {rule.triggered ? (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Indices */}
      <div className="card-dark">
        <h2 className="text-lg font-semibold text-equinox-light mb-6">Market Indices</h2>
        <div className="grid md:grid-cols-5 gap-4">
          {marketIndices.map((index) => (
            <div key={index.name} className="p-4 rounded-lg bg-equinox-purple/20 border border-gold-500/10">
              <p className="text-sm text-gold-300 font-medium mb-2">{index.name}</p>
              <p className="text-2xl font-display font-bold text-equinox-light mb-1">
                {index.value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </p>
              <p className={`text-xs ${index.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Trades */}
      <div className="card-dark overflow-x-auto">
        <h2 className="text-lg font-semibold text-equinox-light mb-6">Recent Trades</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gold-500/20">
              <th className="text-left px-4 py-3 text-gold-400 font-semibold text-sm">Symbol</th>
              <th className="text-center px-4 py-3 text-gold-400 font-semibold text-sm">Type</th>
              <th className="text-right px-4 py-3 text-gold-400 font-semibold text-sm">Quantity</th>
              <th className="text-right px-4 py-3 text-gold-400 font-semibold text-sm">Price</th>
              <th className="text-right px-4 py-3 text-gold-400 font-semibold text-sm">Total</th>
              <th className="text-center px-4 py-3 text-gold-400 font-semibold text-sm">Status</th>
              <th className="text-right px-4 py-3 text-gold-400 font-semibold text-sm">Time</th>
            </tr>
          </thead>
          <tbody>
            {recentTrades.slice(0, 10).map((trade) => (
              <tr key={trade.id} className="border-b border-equinox-purple/30 hover:bg-equinox-purple/20 transition-colors">
                <td className="px-4 py-3 font-medium text-equinox-light">{trade.symbol}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${trade.type === 'buy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {trade.type.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-equinox-light">{trade.qty}</td>
                <td className="px-4 py-3 text-right text-equinox-light">₹{trade.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                <td className="px-4 py-3 text-right text-equinox-light">{formatCurrency(trade.total)}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${trade.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {trade.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-equinox-light/60 text-sm">
                  {trade.timestamp.toLocaleTimeString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
