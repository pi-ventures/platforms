'use client';

import React from 'react';
import { FileText, Download, Share2, Edit, CheckCircle, Calendar, User } from 'lucide-react';
import Link from 'next/link';
import { will, testator, legalOpinion, assets } from '@/lib/mockData';

const WillPage = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-header font-bold text-legal-primary mb-2">
          Your Will
        </h1>
        <p className="text-legal-primary opacity-75">
          View and manage your legal will document
        </p>
      </div>

      {/* Will Status Card */}
      <div className="card-legal mb-8 bg-legal-green bg-opacity-5 border-2 border-legal-green border-opacity-30">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-legal-green bg-opacity-20 rounded-legal flex items-center justify-center">
                <CheckCircle className="text-legal-green" size={24} />
              </div>
              <div>
                <p className="text-sm text-legal-primary opacity-75">Will Status</p>
                <p className="text-2xl font-header font-bold text-legal-green capitalize">
                  {will.status}
                </p>
              </div>
            </div>
            <div className="flex gap-8 text-sm">
              <div>
                <p className="text-legal-primary opacity-75 mb-1">Created</p>
                <p className="font-semibold text-legal-primary">
                  {new Date(will.createdAt).toLocaleDateString()}
                </p>
              </div>
              {will.signedAt && (
                <div>
                  <p className="text-legal-primary opacity-75 mb-1">Signed</p>
                  <p className="font-semibold text-legal-primary">
                    {new Date(will.signedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn-legal-secondary flex items-center gap-2">
              <Download size={18} />
              Download
            </button>
            <button className="btn-legal-outline flex items-center gap-2">
              <Share2 size={18} />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Will Details */}
      <div className="card-legal mb-8">
        <h2 className="text-2xl font-header font-bold text-legal-primary mb-6">
          {will.title}
        </h2>

        <div className="space-y-6">
          {/* Testator Info */}
          <div className="p-4 bg-legal-cream rounded-legal border border-legal-border">
            <p className="text-sm text-legal-primary opacity-75 mb-2 flex items-center gap-2">
              <User size={16} />
              Testator
            </p>
            <p className="font-semibold text-legal-primary">{testator.name}</p>
            <p className="text-sm text-legal-primary opacity-75 mt-1">{testator.address}</p>
          </div>

          {/* Assets Covered */}
          <div>
            <h3 className="text-lg font-header font-bold text-legal-primary mb-4">
              Assets Covered in Will
            </h3>
            <div className="space-y-2">
              {assets.map((asset) => {
                const isCovered = will.assets.includes(asset.id);
                return isCovered ? (
                  <div
                    key={asset.id}
                    className="flex items-center justify-between p-3 bg-legal-cream rounded-legal border border-legal-border"
                  >
                    <div>
                      <p className="font-semibold text-legal-primary">{asset.name}</p>
                      <p className="text-sm text-legal-primary opacity-75 capitalize">
                        {asset.type}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-legal-gold">
                        ₹{(asset.value / 1000000).toFixed(1)}L
                      </p>
                      <CheckCircle className="text-legal-green mt-1" size={18} />
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </div>

          {/* Legal Opinion */}
          {will.legalOpinionId && (
            <div className="p-4 bg-legal-gold bg-opacity-10 rounded-legal border-2 border-legal-gold border-opacity-30">
              <p className="text-sm text-legal-primary opacity-75 mb-2">
                Legal Review
              </p>
              <p className="font-semibold text-legal-primary mb-3">
                {legalOpinion.lawyerName}
              </p>
              <p className="text-sm text-legal-primary mb-3">
                {legalOpinion.firm}
              </p>
              <p className="text-sm text-legal-primary mb-3 italic">
                "{legalOpinion.opinion}"
              </p>
              <p className="text-xs text-legal-primary opacity-75">
                Review Date: {new Date(legalOpinion.date).toLocaleDateString()}
              </p>
            </div>
          )}

          {/* Will Content */}
          <div className="p-6 bg-legal-cream rounded-legal border border-legal-border font-body">
            <p className="text-legal-primary leading-relaxed whitespace-pre-wrap">
              {will.content}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button className="btn-legal-primary flex-1 flex items-center justify-center gap-2">
          <Edit size={18} />
          Edit Will
        </button>
        <button className="btn-legal-outline flex-1 flex items-center justify-center gap-2">
          <FileText size={18} />
          View Full Document
        </button>
      </div>
    </div>
  );
};

export default WillPage;
