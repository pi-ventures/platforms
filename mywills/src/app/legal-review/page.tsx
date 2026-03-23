'use client';

import React from 'react';
import { CheckCircle, Clock, Gavel, MessageSquare, Calendar } from 'lucide-react';
import { legalOpinion } from '@/lib/mockData';

const LegalReviewPage = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-header font-bold text-legal-primary mb-2">
          Legal Review
        </h1>
        <p className="text-legal-primary opacity-75">
          Professional legal opinion from certified advocates
        </p>
      </div>

      {/* Current Review */}
      <div className="card-legal mb-8 bg-legal-green bg-opacity-5 border-2 border-legal-green border-opacity-30">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-legal-green bg-opacity-20 rounded-legal flex items-center justify-center">
              <CheckCircle className="text-legal-green" size={24} />
            </div>
            <div>
              <p className="text-sm text-legal-primary opacity-75">Review Status</p>
              <p className="text-2xl font-header font-bold text-legal-green">
                Approved
              </p>
            </div>
          </div>
          <span className="badge-legal bg-legal-green bg-opacity-20 text-legal-green">
            Valid & Court-Admissible
          </span>
        </div>

        <div className="p-6 bg-legal-cream rounded-legal border border-legal-border">
          <div className="mb-4">
            <p className="text-sm text-legal-primary opacity-75 mb-2">Reviewed By</p>
            <h3 className="text-xl font-header font-bold text-legal-primary mb-1">
              {legalOpinion.lawyerName}
            </h3>
            <p className="text-sm text-legal-primary opacity-75">
              {legalOpinion.firm}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 my-6 p-4 bg-legal-gold bg-opacity-5 rounded-legal">
            <div>
              <p className="text-xs text-legal-primary opacity-75 mb-1">Review Date</p>
              <p className="font-semibold text-legal-primary flex items-center gap-2">
                <Calendar size={16} className="text-legal-gold" />
                {new Date(legalOpinion.date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-legal-primary opacity-75 mb-1">Fee</p>
              <p className="font-semibold text-legal-gold">
                ₹{legalOpinion.fee.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="p-4 bg-legal-primary bg-opacity-5 rounded-legal border-l-4 border-legal-primary">
            <p className="text-sm text-legal-primary leading-relaxed">
              "{legalOpinion.opinion}"
            </p>
          </div>
        </div>
      </div>

      {/* Legal Framework */}
      <div className="card-legal mb-8">
        <h2 className="text-2xl font-header font-bold text-legal-primary mb-6">
          Legal Framework
        </h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Gavel className="text-legal-gold flex-shrink-0" size={20} />
            <div>
              <p className="font-semibold text-legal-primary">Indian Succession Act, 1872</p>
              <p className="text-sm text-legal-primary opacity-75">
                Your will complies with all provisions of the Indian Succession Act, including proper witnessing and testator declaration.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <CheckCircle className="text-legal-green flex-shrink-0" size={20} />
            <div>
              <p className="font-semibold text-legal-primary">Court-Admissible Document</p>
              <p className="text-sm text-legal-primary opacity-75">
                This will is valid and enforceable in all courts of India. No additional authentication required.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <CheckCircle className="text-legal-green flex-shrink-0" size={20} />
            <div>
              <p className="font-semibold text-legal-primary">Execution Requirements Met</p>
              <p className="text-sm text-legal-primary opacity-75">
                All testamentary formalities including signing, witnessing, and declarations have been properly fulfilled.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Lawyer */}
      <div className="card-legal bg-legal-accent bg-opacity-5 border-2 border-legal-accent border-opacity-30">
        <div className="flex items-start gap-4">
          <MessageSquare className="text-legal-accent flex-shrink-0 mt-1" size={24} />
          <div className="flex-1">
            <h3 className="font-semibold text-legal-primary mb-2">
              Need Further Clarification?
            </h3>
            <p className="text-sm text-legal-primary opacity-75 mb-4">
              You can contact your legal advisor for any questions or modifications to your will.
            </p>
            <button className="btn-legal-secondary">
              Schedule Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalReviewPage;
