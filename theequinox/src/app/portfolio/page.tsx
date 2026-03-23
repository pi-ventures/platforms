'use client';

import { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Plus, Trash2, TrendingUp, TrendingDown, Eye, EyeOff } from 'lucide-react';
import { portfolio, portfolioMetrics } from '@/lib/mockData';
import toast from 'react-hot-toast';

const SECTOR_COLORS = ['#C9A84C', '#2D1B69', '#E8C96A', '#92650f', '#6B3FA0'];

export default function PortfolioPage() {
  const [showValue, setShowValue] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
    return `₹${value.toLocaleString('en-IN')}`;
  };

  // Calculate sector allocation
  const sectorAllocation = [
    { name: 'Energy', value: 46.3 },
    { name: 'IT', value: 27.8 },
    { name: 'Banking', value: 13.2 },
    { name: 'Finance', value: 7.2 },
    { name: 'Automobiles', value: 5.5 },
  ];

  const handleAddHolding = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Holding added successfully');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-display font-bold text-equinox-light mb-2">Portfolio</h1>
          <p className="text-equinox-light/60">Holdings and sector allocation analysis</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowValue(!showValue)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gold-500/30 hover:border-gold-500/60 text-gold-300 transition-all"
          >
            {showValue ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {showValue ? 'Hide' : 'Show'} Values
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-gold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Holding
          </button>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="metric-card">
          <p className="text-gold-300 text-sm font-medium mb-2">Total Portfolio Value</p>
          <p className="text-3xl font-display font-bold text-equinox-light">
            {showValue ? formatCurrency(portfolio.totalValue) : '••••'}
          </p>
          <p className="text-xs text-equinox-light/60 mt-2">{portfolio.holdings.length} holdings</p>
        </div>

        <div className="metric-card">
          <p className="text-gold-300 text-sm font-medium mb-2">Total Invested</p>
          <p className="text-3xl font-display font-bold text-equinox-light">
            {showValue ? formatCurrency(portfolio.totalInvested) : '••••'}
          </p>
          <p className="text-xs text-equinox-light/60 mt-2">Capital deployed</p>
        </div>

        <div className="metric-card">
          <p className="text-gold-300 text-sm font-medium mb-2">Total Unrealized P&L</p>
          <p className="text-3xl font-display font-bold text-emerald-400">
            {showValue ? formatCurrency(portfolio.totalPnL) : '••••'}
          </p>
          <p className="text-xs text-emerald-400 mt-2">+{portfolio.totalPnLPercent.toFixed(1)}%</p>
        </div>

        <div className="metric-card">
          <p className="text-gold-300 text-sm font-medium mb-2">Average Entry Price</p>
          <p className="text-3xl font-display font-bold text-equinox-light">
            {showValue ? (portfolio.totalInvested / portfolio.holdings.reduce((sum, h) => sum + h.qty, 0)).toFixed(2) : '••••'}
          </p>
          <p className="text-xs text-equinox-light/60 mt-2">Per share</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Sector Allocation */}
        <div className="card-dark">
          <h2 className="text-lg font-semibold text-equinox-light mb-6">Sector Allocation</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sectorAllocation}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {sectorAllocation.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={SECTOR_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#1E1040',
                  border: '1px solid rgba(201,168,76,0.3)',
                  borderRadius: '8px',
                }}
                formatter={(value) => `${value}%`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Portfolio Performance */}
        <div className="card-dark">
          <h2 className="text-lg font-semibold text-equinox-light mb-6">Portfolio Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={portfolioMetrics}>
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
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#C9A84C" name="Portfolio Value" strokeWidth={2} />
              <Line type="monotone" dataKey="invested" stroke="#2D1B69" name="Invested" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Add Holding Form */}
      {showAddForm && (
        <div className="card-dark border-2 border-gold-500/50">
          <h2 className="text-2xl font-display font-bold text-equinox-light mb-6">Add Holding</h2>
          <form onSubmit={handleAddHolding} className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gold-300 mb-2">Stock Symbol</label>
              <input
                type="text"
                placeholder="e.g., RELIANCE"
                className="w-full bg-equinox-darker border border-gold-500/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-gold-500/60 focus:ring-2 focus:ring-gold-500/30"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gold-300 mb-2">Stock Name</label>
              <input
                type="text"
                placeholder="e.g., Reliance Industries"
                className="w-full bg-equinox-darker border border-gold-500/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-gold-500/60 focus:ring-2 focus:ring-gold-500/30"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gold-300 mb-2">Quantity</label>
              <input
                type="number"
                placeholder="0"
                className="w-full bg-equinox-darker border border-gold-500/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-gold-500/60 focus:ring-2 focus:ring-gold-500/30"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gold-300 mb-2">Average Purchase Price</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full bg-equinox-darker border border-gold-500/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-gold-500/60 focus:ring-2 focus:ring-gold-500/30"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gold-300 mb-2">Current Price</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full bg-equinox-darker border border-gold-500/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-gold-500/60 focus:ring-2 focus:ring-gold-500/30"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gold-300 mb-2">Sector</label>
              <select className="w-full bg-equinox-darker border border-gold-500/20 rounded-lg px-4 py-2.5 text-white focus:border-gold-500/60 focus:ring-2 focus:ring-gold-500/30">
                <option>Energy</option>
                <option>IT</option>
                <option>Banking</option>
                <option>Finance</option>
                <option>Automobiles</option>
                <option>FMCG</option>
                <option>Pharma</option>
              </select>
            </div>

            <div className="md:col-span-2 flex gap-4">
              <button type="submit" className="btn-gold flex-1">
                Add Holding
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 btn-gold-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Holdings Table */}
      <div className="card-dark overflow-x-auto">
        <h2 className="text-lg font-semibold text-equinox-light mb-6">Current Holdings</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gold-500/20">
              <th className="text-left px-4 py-3 text-gold-400 font-semibold text-sm">Stock</th>
              <th className="text-right px-4 py-3 text-gold-400 font-semibold text-sm">Qty</th>
              <th className="text-right px-4 py-3 text-gold-400 font-semibold text-sm">Avg Price</th>
              <th className="text-right px-4 py-3 text-gold-400 font-semibold text-sm">CMP</th>
              <th className="text-right px-4 py-3 text-gold-400 font-semibold text-sm">Value</th>
              <th className="text-right px-4 py-3 text-gold-400 font-semibold text-sm">P&L</th>
              <th className="text-center px-4 py-3 text-gold-400 font-semibold text-sm">Day Chg</th>
              <th className="text-center px-4 py-3 text-gold-400 font-semibold text-sm">Action</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.holdings.map(holding => (
              <tr key={holding.symbol} className="border-b border-equinox-purple/30 hover:bg-equinox-purple/20 transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-semibold text-equinox-light">{holding.symbol}</p>
                    <p className="text-xs text-equinox-light/60">{holding.name}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-equinox-light">{holding.qty}</td>
                <td className="px-4 py-3 text-right text-equinox-light">₹{holding.avgPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                <td className="px-4 py-3 text-right text-equinox-light">₹{holding.currentPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                <td className="px-4 py-3 text-right text-equinox-light font-semibold">
                  {showValue ? formatCurrency(holding.value) : '••••'}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className={holding.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                    <p className="font-semibold">{showValue ? formatCurrency(holding.pnl) : '••••'}</p>
                    <p className="text-xs">{holding.pnlPercent >= 0 ? '+' : ''}{holding.pnlPercent.toFixed(2)}%</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className={holding.dayChange >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                    {holding.dayChange >= 0 ? (
                      <TrendingUp className="w-4 h-4 mx-auto" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mx-auto" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <button className="p-2 rounded-lg bg-equinox-purple/30 hover:bg-equinox-purple/50 transition-colors">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card-dark">
          <p className="text-gold-300 text-sm font-medium mb-3">Largest Holding</p>
          <p className="text-2xl font-display font-bold text-equinox-light mb-1">
            {portfolio.holdings.reduce((max, h) => h.value > max.value ? h : max).symbol}
          </p>
          <p className="text-xs text-equinox-light/60">
            {showValue ? formatCurrency(Math.max(...portfolio.holdings.map(h => h.value))) : '••••'}
          </p>
        </div>

        <div className="card-dark">
          <p className="text-gold-300 text-sm font-medium mb-3">Best Performer</p>
          <p className="text-2xl font-display font-bold text-emerald-400 mb-1">
            {portfolio.holdings.reduce((max, h) => h.pnlPercent > max.pnlPercent ? h : max).symbol}
          </p>
          <p className="text-xs text-emerald-400">
            +{portfolio.holdings.reduce((max, h) => h.pnlPercent > max.pnlPercent ? h : max).pnlPercent.toFixed(2)}%
          </p>
        </div>

        <div className="card-dark">
          <p className="text-gold-300 text-sm font-medium mb-3">Diversification</p>
          <p className="text-2xl font-display font-bold text-equinox-light mb-1">
            {portfolio.holdings.length}
          </p>
          <p className="text-xs text-equinox-light/60">stocks across sectors</p>
        </div>
      </div>
    </div>
  );
}
