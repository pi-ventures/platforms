'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Building2, ArrowUpRight, MapPin, ExternalLink, RefreshCw, TrendingUp } from 'lucide-react';
import { mockProperties, mockNetWorth, getTimeAgo, formatCurrency } from '@/lib/mockData';

export default function PropertiesPage() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const totalValue = mockProperties.reduce((sum, prop) => sum + prop.value, 0);
  const activeCount = mockProperties.filter((p) => p.status === 'active').length;

  return (
    <AppLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-5xl font-playfair font-800 text-vault-gold-light mb-2">
              Real Estate Portfolio
            </h1>
            <p className="text-gray-400">Synced from YesBroker - All your properties in one place</p>
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

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="card-vault">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Total Properties</p>
            <p className="text-4xl font-playfair font-800 text-vault-gold-light">{mockProperties.length}</p>
            <p className="text-sm text-gray-500 mt-2">{activeCount} active listings</p>
          </div>

          <div className="card-vault">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Total Value</p>
            <p className="text-3xl font-playfair font-800 text-vault-gold-light">{formatCurrency(totalValue)}</p>
            <p className="text-sm text-gray-500 mt-2">{((totalValue / mockNetWorth.total) * 100).toFixed(1)}% of net worth</p>
          </div>

          <div className="card-vault">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Average ROI</p>
            <p className="text-3xl font-playfair font-800 text-vault-gold-light">
              +{(mockProperties.reduce((sum, p) => sum + (p.roi || 0), 0) / mockProperties.length).toFixed(1)}%
            </p>
            <p className="text-sm text-green-500 mt-2">Year-over-year</p>
          </div>

          <div className="card-vault">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Last Sync</p>
            <p className="text-3xl font-playfair font-800 text-vault-gold-light">Now</p>
            <p className="text-sm text-gray-500 mt-2">Real-time updates enabled</p>
          </div>
        </div>

        {/* Properties List */}
        <div>
          <h2 className="text-2xl font-playfair font-700 text-vault-gold-light mb-6">Your Properties</h2>
          <div className="space-y-4">
            {mockProperties.map((property, index) => (
              <div key={property.id} className="card-vault group hover:shadow-gold">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-vault-gold/20 to-vault-gold-light/20 flex items-center justify-center flex-shrink-0 group-hover:from-vault-gold/30 group-hover:to-vault-gold-light/30 transition-all">
                      <Building2 className="w-6 h-6 text-vault-gold-light" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-playfair font-700 text-vault-gold-light">
                          {property.address}
                        </h3>
                        <span className="badge-vault text-xs capitalize">{property.type}</span>
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        Last updated {getTimeAgo(property.lastUpdated)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-3xl font-playfair font-700 text-vault-gold-light">
                      {formatCurrency(property.value)}
                    </p>
                    <p className={`text-sm font-semibold flex items-center justify-end gap-1 mt-1 ${
                      property.roi && property.roi > 0 ? 'text-green-500' : 'text-gray-500'
                    }`}>
                      {property.roi && (
                        <>
                          <TrendingUp className="w-4 h-4" />
                          +{property.roi}%
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-vault-gold/20">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <div className={`badge-vault capitalize ${
                        property.status === 'active'
                          ? 'badge-vault-success'
                          : property.status === 'rented'
                          ? 'badge-vault-warning'
                          : ''
                      }`}>
                        {property.status}
                      </div>
                    </div>
                  </div>

                  <a
                    href="#"
                    className="flex items-center gap-2 text-vault-gold hover:text-vault-gold-light transition-colors font-medium text-sm"
                  >
                    Open in YesBroker <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* YesBroker Integration Info */}
        <div className="card-vault-premium border-2 border-vault-gold/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-vault-gold/20 to-vault-gold-light/20 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-6 h-6 text-vault-gold-light" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-playfair font-700 text-vault-gold-light mb-2">YesBroker Integration</h3>
              <p className="text-gray-400 mb-4">
                All your property data is automatically synced from YesBroker. Updates happen in real-time whenever you add or modify properties in YesBroker.
              </p>
              <div className="flex gap-4">
                <button className="btn-vault text-sm">Open YesBroker Portal</button>
                <button className="btn-vault-outline text-sm">Manage Sync Settings</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
