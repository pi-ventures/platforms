'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { FileText, ExternalLink, RefreshCw, CheckCircle, AlertCircle, Users } from 'lucide-react';
import { mockWill, mockBeneficiaries, mockNetWorth, getTimeAgo, formatCurrency } from '@/lib/mockData';

export default function LegalPage() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  return (
    <AppLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-5xl font-playfair font-800 text-vault-gold-light mb-2">
              Legal & Estate Planning
            </h1>
            <p className="text-gray-400">Synced from MyWills via legalopinion.co.in</p>
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

        {/* Will Status */}
        <div className="card-vault-premium">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-playfair font-700 text-vault-gold-light mb-2">{mockWill.name}</h2>
              <p className="text-gray-400">Created on {mockWill.createdDate.toLocaleDateString('en-IN')}</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/40">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-300 font-semibold capitalize">{mockWill.status}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-vault-gold/20">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Estate Assets Covered</p>
              <p className="text-3xl font-playfair font-800 text-vault-gold-light">
                {formatCurrency(mockNetWorth.willAssets)}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Total Assets</p>
              <p className="text-3xl font-playfair font-800 text-vault-gold-light">
                {formatCurrency(mockNetWorth.total)}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Coverage</p>
              <p className="text-3xl font-playfair font-800 text-vault-gold-light">95%</p>
              <p className="text-sm text-gray-500 mt-1">of total net worth</p>
            </div>
          </div>
        </div>

        {/* Legal Opinion Status */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-vault">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-playfair font-700 text-vault-gold-light">Legal Opinion</h3>
                <p className="text-sm text-gray-400">From legalopinion.co.in</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-sm text-gray-400 mb-1">Status</p>
                <p className="font-semibold text-green-400">Approved</p>
              </div>
              <div className="p-3 rounded-lg bg-vault-gold/10 border border-vault-gold/20">
                <p className="text-sm text-gray-400 mb-1">Last Verified</p>
                <p className="font-semibold text-vault-gold-light">{getTimeAgo(new Date(Date.now() - 30 * 24 * 3600000))}</p>
              </div>
              <button className="w-full btn-vault-outline text-sm">View Legal Opinion</button>
            </div>
          </div>

          <div className="card-vault">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-vault-gold flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-playfair font-700 text-vault-gold-light">Document Status</h3>
                <p className="text-sm text-gray-400">MyWills (iWills)</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-vault-gold/10 border border-vault-gold/20">
                <p className="text-sm text-gray-400 mb-1">Will Document</p>
                <p className="font-semibold text-vault-gold-light">Executed & Registered</p>
              </div>
              <div className="p-3 rounded-lg bg-vault-gold/10 border border-vault-gold/20">
                <p className="text-sm text-gray-400 mb-1">Last Updated</p>
                <p className="font-semibold text-vault-gold-light">{getTimeAgo(mockWill.lastUpdated)}</p>
              </div>
              <button className="w-full btn-vault-outline text-sm">Edit Will</button>
            </div>
          </div>
        </div>

        {/* Beneficiaries */}
        <div>
          <h2 className="text-2xl font-playfair font-700 text-vault-gold-light mb-6">Beneficiaries</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {mockBeneficiaries.map((beneficiary, index) => (
              <div key={index} className="card-vault">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-vault-gold" />
                  <div>
                    <h3 className="font-playfair font-700 text-vault-gold-light">{beneficiary.name}</h3>
                    <p className="text-sm text-gray-500">{beneficiary.relationship}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Allocation</p>
                    <div className="w-full h-2 rounded-full bg-vault-gold/20 overflow-hidden mb-1">
                      <div 
                        className="h-full bg-gradient-to-r from-vault-gold to-vault-gold-light transition-all" 
                        style={{ width: `${beneficiary.allocation}%` }}
                      ></div>
                    </div>
                    <p className="text-sm font-bold text-vault-gold-light">{beneficiary.allocation}%</p>
                  </div>

                  <p className="text-xs text-gray-500 pt-2">
                    Estimated: {formatCurrency(mockNetWorth.willAssets * (beneficiary.allocation / 100))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assets Coverage */}
        <div>
          <h2 className="text-2xl font-playfair font-700 text-vault-gold-light mb-6">Assets Covered in Will</h2>
          <div className="card-vault space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-vault-gold/20">
              <div>
                <p className="font-semibold text-vault-gold-light">Real Estate Properties</p>
                <p className="text-sm text-gray-500">5 properties listed</p>
              </div>
              <p className="text-2xl font-playfair font-700 text-vault-gold-light">
                {formatCurrency(mockNetWorth.realEstate)}
              </p>
            </div>

            <div className="flex items-center justify-between pb-4 border-b border-vault-gold/20">
              <div>
                <p className="font-semibold text-vault-gold-light">Investment Portfolio</p>
                <p className="text-sm text-gray-500">5 stock holdings</p>
              </div>
              <p className="text-2xl font-playfair font-700 text-vault-gold-light">
                {formatCurrency(mockNetWorth.investments)}
              </p>
            </div>

            <div className="flex items-center justify-between pb-4 border-b border-vault-gold/20">
              <div>
                <p className="font-semibold text-vault-gold-light">Cash & Deposits</p>
                <p className="text-sm text-gray-500">Bank accounts and savings</p>
              </div>
              <p className="text-2xl font-playfair font-700 text-vault-gold-light">
                {formatCurrency(mockNetWorth.cash)}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-vault-gold-light">Other Assets</p>
                <p className="text-sm text-gray-500">Jewels, vehicles, etc.</p>
              </div>
              <p className="text-2xl font-playfair font-700 text-vault-gold-light">
                {formatCurrency(mockNetWorth.other)}
              </p>
            </div>

            <div className="pt-4 border-t-2 border-vault-gold/40">
              <div className="flex items-center justify-between">
                <p className="font-playfair font-700 text-vault-gold-light text-lg">Total Estate Value</p>
                <p className="text-3xl font-playfair font-700 text-vault-gold-light">
                  {formatCurrency(mockNetWorth.willAssets)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Documents */}
        <div>
          <h2 className="text-2xl font-playfair font-700 text-vault-gold-light mb-6">Important Documents</h2>
          <div className="space-y-3">
            {[
              { name: 'Original Will Document', status: 'stored', date: 'Jan 15, 2024' },
              { name: 'Legal Opinion from legalopinion.co.in', status: 'approved', date: 'Dec 28, 2024' },
              { name: 'Asset Inventory List', status: 'updated', date: 'Jan 5, 2026' },
              { name: 'Beneficiary Consent Forms', status: 'signed', date: 'Jan 10, 2024' },
            ].map((doc, index) => (
              <div key={index} className="card-vault group flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-vault-gold" />
                  <div>
                    <p className="font-semibold text-vault-gold-light">{doc.name}</p>
                    <p className="text-xs text-gray-500">{doc.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge-vault capitalize ${
                    doc.status === 'approved' ? 'badge-vault-success' :
                    doc.status === 'signed' ? 'badge-vault-success' :
                    doc.status === 'updated' ? 'badge-vault-warning' : ''
                  }`}>
                    {doc.status}
                  </span>
                  <a href="#" className="p-2 rounded-lg hover:bg-vault-gold/10 text-vault-gold hover:text-vault-gold-light transition-colors">
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MyWills Integration Info */}
        <div className="card-vault-premium border-2 border-vault-gold/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-vault-gold/20 to-vault-gold-light/20 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-vault-gold-light" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-playfair font-700 text-vault-gold-light mb-2">MyWills & legalopinion.co.in Integration</h3>
              <p className="text-gray-400 mb-4">
                Your will and estate planning documents are securely synced from MyWills (iWills) and managed through legalopinion.co.in. All legal opinions and document verifications are automatically updated.
              </p>
              <div className="flex gap-4">
                <button className="btn-vault text-sm">Open MyWills Portal</button>
                <button className="btn-vault-outline text-sm">Contact Legal Advisor</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
