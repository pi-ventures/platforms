'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit2, Power, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { autoTradeRules, recentTrades, stocks } from '@/lib/mockData';
import toast from 'react-hot-toast';

export default function TradingPage() {
  const [rules, setRules] = useState(autoTradeRules);
  const [showNewRuleForm, setShowNewRuleForm] = useState(false);
  const [showTradeForm, setShowTradeForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'sip',
    condition: '',
    target: '',
  });
  const [tradeForm, setTradeForm] = useState({
    symbol: 'RELIANCE',
    type: 'buy',
    quantity: 1,
    price: 2847.55,
  });

  const toggleRule = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r));
    toast.success('Rule updated');
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
    toast.success('Rule deleted');
  };

  const createRule = (e: React.FormEvent) => {
    e.preventDefault();
    const newRule = {
      id: `R${Date.now()}`,
      name: formData.name,
      type: formData.type as 'buy' | 'sell' | 'rebalance' | 'sip' | 'stop-loss',
      condition: formData.condition,
      target: formData.target,
      active: true,
      triggered: false,
    };
    setRules([...rules, newRule]);
    setFormData({ name: '', type: 'sip', condition: '', target: '' });
    setShowNewRuleForm(false);
    toast.success('Trading rule created');
  };

  const executeTrade = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`${tradeForm.type === 'buy' ? 'Buy' : 'Sell'} order placed for ${tradeForm.quantity} shares of ${tradeForm.symbol}`);
    setShowTradeForm(false);
  };

  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
    return `₹${value.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-display font-bold text-equinox-light mb-2">Trading</h1>
          <p className="text-equinox-light/60">Auto-trading rules and manual trading</p>
        </div>
        <button
          onClick={() => setShowTradeForm(true)}
          className="btn-gold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Execute Trade
        </button>
      </div>

      {/* Manual Trade Form */}
      {showTradeForm && (
        <div className="card-dark border-2 border-gold-500/50">
          <h2 className="text-2xl font-display font-bold text-equinox-light mb-6">Execute Trade</h2>
          <form onSubmit={executeTrade} className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gold-300 mb-2">Stock Symbol</label>
              <select
                value={tradeForm.symbol}
                onChange={(e) => {
                  const stock = stocks.find(s => s.symbol === e.target.value);
                  if (stock) {
                    setTradeForm({ ...tradeForm, symbol: stock.symbol, price: stock.price });
                  }
                }}
                className="w-full bg-equinox-darker border border-gold-500/20 rounded-lg px-4 py-2.5 text-white focus:border-gold-500/60 focus:ring-2 focus:ring-gold-500/30"
              >
                {stocks.map(stock => (
                  <option key={stock.symbol} value={stock.symbol}>
                    {stock.symbol} - {stock.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gold-300 mb-2">Order Type</label>
              <select
                value={tradeForm.type}
                onChange={(e) => setTradeForm({ ...tradeForm, type: e.target.value as 'buy' | 'sell' })}
                className="w-full bg-equinox-darker border border-gold-500/20 rounded-lg px-4 py-2.5 text-white focus:border-gold-500/60 focus:ring-2 focus:ring-gold-500/30"
              >
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gold-300 mb-2">Quantity</label>
              <input
                type="number"
                min="1"
                value={tradeForm.quantity}
                onChange={(e) => setTradeForm({ ...tradeForm, quantity: parseInt(e.target.value) })}
                className="w-full bg-equinox-darker border border-gold-500/20 rounded-lg px-4 py-2.5 text-white focus:border-gold-500/60 focus:ring-2 focus:ring-gold-500/30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gold-300 mb-2">Price per Share</label>
              <input
                type="number"
                step="0.01"
                value={tradeForm.price}
                onChange={(e) => setTradeForm({ ...tradeForm, price: parseFloat(e.target.value) })}
                className="w-full bg-equinox-darker border border-gold-500/20 rounded-lg px-4 py-2.5 text-white focus:border-gold-500/60 focus:ring-2 focus:ring-gold-500/30"
              />
            </div>

            <div className="md:col-span-2 p-4 rounded-lg bg-equinox-purple/20 border border-gold-500/20">
              <p className="text-gold-300 text-sm mb-2">Total Value</p>
              <p className="text-3xl font-display font-bold text-equinox-light">
                {formatCurrency(tradeForm.quantity * tradeForm.price)}
              </p>
            </div>

            <div className="md:col-span-2 flex gap-4">
              <button type="submit" className="btn-gold flex-1">
                Confirm Trade
              </button>
              <button
                type="button"
                onClick={() => setShowTradeForm(false)}
                className="flex-1 btn-gold-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Create New Rule Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-display font-bold text-equinox-light">Auto Trading Rules</h2>
          <button
            onClick={() => setShowNewRuleForm(!showNewRuleForm)}
            className="btn-gold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Rule
          </button>
        </div>

        {showNewRuleForm && (
          <div className="card-dark border-2 border-gold-500/50 mb-8">
            <form onSubmit={createRule} className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gold-300 mb-2">Rule Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Monthly SIP"
                  className="w-full bg-equinox-darker border border-gold-500/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-gold-500/60 focus:ring-2 focus:ring-gold-500/30"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gold-300 mb-2">Rule Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-equinox-darker border border-gold-500/20 rounded-lg px-4 py-2.5 text-white focus:border-gold-500/60 focus:ring-2 focus:ring-gold-500/30"
                >
                  <option value="sip">SIP (Systematic Investment)</option>
                  <option value="stop-loss">Stop Loss</option>
                  <option value="sell">Profit Booking</option>
                  <option value="rebalance">Rebalance</option>
                  <option value="buy">Buy on Dip</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gold-300 mb-2">Condition</label>
                <input
                  type="text"
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  placeholder="e.g., Every 1st of month"
                  className="w-full bg-equinox-darker border border-gold-500/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-gold-500/60 focus:ring-2 focus:ring-gold-500/30"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gold-300 mb-2">Target Action</label>
                <input
                  type="text"
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  placeholder="e.g., Invest ₹25,000"
                  className="w-full bg-equinox-darker border border-gold-500/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-gold-500/60 focus:ring-2 focus:ring-gold-500/30"
                  required
                />
              </div>

              <div className="md:col-span-2 flex gap-4">
                <button type="submit" className="btn-gold flex-1">
                  Create Rule
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewRuleForm(false)}
                  className="flex-1 btn-gold-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Active Rules */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-equinox-light">Active Rules ({rules.filter(r => r.active).length})</h3>
        {rules
          .filter(r => r.active)
          .map(rule => (
            <div key={rule.id} className="card-dark">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-equinox-light">{rule.name}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${rule.type === 'sip' ? 'bg-blue-500/20 text-blue-300' : rule.type === 'stop-loss' ? 'bg-red-500/20 text-red-300' : rule.type === 'sell' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-purple-500/20 text-purple-300'}`}>
                      {rule.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gold-300 font-medium mb-1">Condition</p>
                      <p className="text-equinox-light/80">{rule.condition}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gold-300 font-medium mb-1">Target Action</p>
                      <p className="text-equinox-light/80">{rule.target}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className="p-2 rounded-lg bg-equinox-purple/30 hover:bg-equinox-purple/50 transition-colors"
                  >
                    <Power className="w-5 h-5 text-emerald-400" />
                  </button>
                  <button className="p-2 rounded-lg bg-equinox-purple/30 hover:bg-equinox-purple/50 transition-colors">
                    <Edit2 className="w-5 h-5 text-gold-400" />
                  </button>
                  <button
                    onClick={() => deleteRule(rule.id)}
                    className="p-2 rounded-lg bg-equinox-purple/30 hover:bg-equinox-purple/50 transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </button>
                </div>
              </div>
              {rule.triggered && (
                <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-yellow-300">Rule triggered - Waiting for execution</span>
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Inactive Rules */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-equinox-light">Inactive Rules ({rules.filter(r => !r.active).length})</h3>
        {rules
          .filter(r => !r.active)
          .map(rule => (
            <div key={rule.id} className="card-dark opacity-60">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-equinox-light/60">{rule.name}</h4>
                  <p className="text-sm text-equinox-light/40 mt-2">{rule.condition}</p>
                </div>
                <button
                  onClick={() => toggleRule(rule.id)}
                  className="p-2 rounded-lg bg-equinox-purple/30 hover:bg-equinox-purple/50 transition-colors"
                >
                  <Power className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Recent Trades */}
      <div className="card-dark">
        <h2 className="text-lg font-semibold text-equinox-light mb-6">Recent Trades Log</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold-500/20">
                <th className="text-left px-4 py-3 text-gold-400 font-semibold text-sm">Symbol</th>
                <th className="text-center px-4 py-3 text-gold-400 font-semibold text-sm">Type</th>
                <th className="text-right px-4 py-3 text-gold-400 font-semibold text-sm">Qty</th>
                <th className="text-right px-4 py-3 text-gold-400 font-semibold text-sm">Price</th>
                <th className="text-right px-4 py-3 text-gold-400 font-semibold text-sm">Total</th>
                <th className="text-center px-4 py-3 text-gold-400 font-semibold text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTrades.slice(0, 8).map(trade => (
                <tr key={trade.id} className="border-b border-equinox-purple/30 hover:bg-equinox-purple/20">
                  <td className="px-4 py-3 font-medium text-equinox-light">{trade.symbol}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${trade.type === 'buy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {trade.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-equinox-light">{trade.qty}</td>
                  <td className="px-4 py-3 text-right text-equinox-light">₹{trade.price.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-right text-equinox-light">{formatCurrency(trade.total)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${trade.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {trade.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
