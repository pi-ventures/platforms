'use client';

import React, { useState } from 'react';
import {
  Home,
  TrendingUp,
  Car,
  Gem,
  Package,
  Plus,
  Edit,
  Trash2,
  Users,
  MapPin,
  DollarSign,
} from 'lucide-react';
import Link from 'next/link';
import { assets, familyMembers, estateStats } from '@/lib/mockData';

const AssetsPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'property':
        return Home;
      case 'investment':
        return TrendingUp;
      case 'vehicle':
        return Car;
      case 'jewelry':
        return Gem;
      default:
        return Package;
    }
  };

  const getAssetColor = (type: string) => {
    switch (type) {
      case 'property':
        return 'bg-legal-green';
      case 'investment':
        return 'bg-legal-gold';
      case 'vehicle':
        return 'bg-legal-accent';
      case 'jewelry':
        return 'bg-legal-primary';
      default:
        return 'bg-legal-primary';
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)}Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)}L`;
    }
    return `₹${value.toLocaleString()}`;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-header font-bold text-legal-primary mb-2">
            Your Assets
          </h1>
          <p className="text-legal-primary opacity-75">
            Manage and track all your valuable assets
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-legal-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Asset
        </button>
      </div>

      {/* Total Value Card */}
      <div className="card-legal mb-8 bg-legal-gold bg-opacity-10 border-2 border-legal-gold border-opacity-30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-legal-primary opacity-75 mb-1">Total Estate Value</p>
            <p className="text-4xl font-header font-bold text-legal-gold">
              {formatCurrency(estateStats.totalValue)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-legal-primary opacity-75 mb-2">Assets Tracked</p>
            <p className="text-3xl font-header font-bold text-legal-primary">
              {estateStats.totalAssets}
            </p>
          </div>
        </div>
      </div>

      {/* Assets by Type */}
      <div className="mb-8">
        <h2 className="text-2xl font-header font-bold text-legal-primary mb-6">
          Assets by Category
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { type: 'property', label: 'Properties', count: 2, icon: Home },
            { type: 'investment', label: 'Investments', count: 2, icon: TrendingUp },
            { type: 'jewelry', label: 'Jewelry', count: 1, icon: Gem },
            { type: 'vehicle', label: 'Vehicles', count: 1, icon: Car },
          ].map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div key={idx} className="card-legal">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-legal-primary opacity-75 mb-1">{cat.label}</p>
                    <p className="text-3xl font-header font-bold text-legal-primary">
                      {cat.count}
                    </p>
                  </div>
                  <div className={`${getAssetColor(cat.type)} w-12 h-12 rounded-legal flex items-center justify-center`}>
                    <Icon className="text-legal-cream" size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assets List */}
      <div className="space-y-6">
        {assets.map((asset) => {
          const Icon = getAssetIcon(asset.type);
          const totalBeneficiaryPercentage = asset.beneficiaries.reduce(
            (sum, b) => sum + b.percentage,
            0
          );

          return (
            <div key={asset.id} className="card-legal hover:shadow-legal-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={`${getAssetColor(asset.type)} w-12 h-12 rounded-legal flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className="text-legal-cream" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-header font-bold text-legal-primary">
                        {asset.name}
                      </h3>
                      <span className="badge-legal capitalize">
                        {asset.type}
                      </span>
                    </div>
                    <p className="text-sm text-legal-primary opacity-75 mb-2">
                      {asset.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-legal-primary opacity-75">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{asset.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign size={14} />
                        <span>{formatCurrency(asset.value)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-legal-light rounded-legal transition-colors">
                    <Edit size={18} className="text-legal-primary" />
                  </button>
                  <button className="p-2 hover:bg-legal-light rounded-legal transition-colors">
                    <Trash2 size={18} className="text-legal-primary opacity-50" />
                  </button>
                </div>
              </div>

              {/* Documents */}
              {asset.documents.length > 0 && (
                <div className="mb-4 p-3 bg-legal-cream rounded-legal border border-legal-border">
                  <p className="text-xs font-semibold text-legal-primary opacity-75 mb-2">
                    Documents
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {asset.documents.map((doc, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-legal-primary bg-opacity-10 text-legal-primary px-2 py-1 rounded-legal"
                      >
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Beneficiaries */}
              <div className="pt-4 border-t border-legal-border">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-legal-primary flex items-center gap-1">
                    <Users size={16} />
                    Beneficiary Distribution
                  </p>
                  <span className="text-sm text-legal-primary opacity-75">
                    {totalBeneficiaryPercentage}% allocated
                  </span>
                </div>
                <div className="space-y-2">
                  {asset.beneficiaries.map((beneficiary) => {
                    const beneficiaryName = familyMembers.find(
                      (m) => m.id === beneficiary.personId
                    )?.name || 'Unknown';
                    return (
                      <div
                        key={beneficiary.personId}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-legal-gold bg-opacity-20 rounded-full flex items-center justify-center">
                            <span className="text-xs font-semibold text-legal-gold">
                              {beneficiary.percentage}%
                            </span>
                          </div>
                          <span className="text-legal-primary">{beneficiaryName}</span>
                        </div>
                        {beneficiary.conditions && (
                          <span className="text-xs text-legal-primary opacity-75 italic">
                            {beneficiary.conditions}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-legal-primary bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card-legal max-w-md w-full">
            <h2 className="text-2xl font-header font-bold text-legal-primary mb-4">
              Add New Asset
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-legal-primary mb-2">
                  Asset Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Mumbai Flat"
                  className="w-full px-4 py-2 border border-legal-border rounded-legal focus:border-legal-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-legal-primary mb-2">
                  Type
                </label>
                <select className="w-full px-4 py-2 border border-legal-border rounded-legal focus:border-legal-gold">
                  <option>Property</option>
                  <option>Investment</option>
                  <option>Vehicle</option>
                  <option>Jewelry</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-legal-primary mb-2">
                  Value (₹)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full px-4 py-2 border border-legal-border rounded-legal focus:border-legal-gold"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 btn-legal-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-legal-primary"
                >
                  Add Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetsPage;
