'use client';

import React, { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Calendar,
  UserCheck,
} from 'lucide-react';
import Link from 'next/link';
import { familyMembers, testator } from '@/lib/mockData';

const FamilyPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const legalHeirs = familyMembers.filter((m) => m.isLegalHeir);
  const otherMembers = familyMembers.filter((m) => !m.isLegalHeir);

  const getRelationshipColor = (role: string) => {
    switch (role) {
      case 'spouse':
        return 'bg-legal-gold';
      case 'child':
        return 'bg-legal-green';
      case 'parent':
        return 'bg-legal-accent';
      case 'sibling':
        return 'bg-legal-primary';
      default:
        return 'bg-legal-primary';
    }
  };

  const FamilyTree = () => {
    return (
      <div className="card-legal mb-8">
        <h2 className="text-2xl font-header font-bold text-legal-primary mb-8">
          Family Tree
        </h2>
        
        <div className="space-y-6">
          {/* Testator */}
          <div className="flex justify-center">
            <div className="w-32 card-legal border-2 border-legal-gold text-center">
              <p className="text-sm text-legal-primary opacity-75 mb-2">Testator</p>
              <p className="font-header font-bold text-legal-gold mb-1">{testator.name}</p>
              <p className="text-xs text-legal-primary opacity-75">
                {new Date().getFullYear() - parseInt(testator.dob.split('-')[0])} years
              </p>
            </div>
          </div>

          {/* Tree Lines */}
          <div className="flex justify-center">
            <div className="w-0.5 h-8 bg-legal-primary opacity-30"></div>
          </div>

          {/* Family Members Row */}
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {familyMembers.map((member) => (
              <div key={member.id} className="relative">
                {/* Connection line */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-legal-primary opacity-30"></div>
                
                <div
                  className={`card-legal ${
                    member.isLegalHeir
                      ? 'border-2 border-legal-green'
                      : 'border border-legal-border opacity-75'
                  }`}
                >
                  <div className="text-center mb-3">
                    <p className="text-xs font-semibold text-legal-primary opacity-75 mb-2 uppercase">
                      {member.role}
                    </p>
                    <p className="font-header font-bold text-legal-primary">
                      {member.name.split(' ')[0]}
                    </p>
                    {member.isLegalHeir && (
                      <p className="text-xs text-legal-green font-semibold mt-1 flex items-center justify-center gap-1">
                        <Check size={12} />
                        Legal Heir
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-legal-primary opacity-75 text-center">
                    {member.sharePercentage}% share
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-header font-bold text-legal-primary mb-2">
            Family Tree & Heirs
          </h1>
          <p className="text-legal-primary opacity-75">
            Manage family members and designate legal heirs
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-legal-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Family Member
        </button>
      </div>

      {/* Family Tree Visualization */}
      <FamilyTree />

      {/* Legal Heirs Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-header font-bold text-legal-primary mb-4 flex items-center gap-2">
          <UserCheck className="text-legal-green" size={28} />
          Legal Heirs (Class I & II)
        </h2>
        <p className="text-legal-primary opacity-75 mb-6">
          According to the Indian Succession Act, 1872, Class I heirs (spouse, children, parents) have priority over Class II heirs (siblings).
        </p>

        <div className="space-y-4">
          {legalHeirs.map((member) => (
            <div key={member.id} className="card-legal border-2 border-legal-green border-opacity-30 hover:shadow-legal-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-header font-bold text-legal-primary">
                      {member.name}
                    </h3>
                    <span className={`${getRelationshipColor(member.role)} text-legal-cream px-3 py-1 rounded-full text-xs font-semibold`}>
                      {member.role}
                    </span>
                    <span className="bg-legal-green text-legal-cream px-3 py-1 rounded-full text-xs font-semibold">
                      {member.role === 'spouse' || member.role === 'child' || member.role === 'parent'
                        ? 'Class I Heir'
                        : 'Class II Heir'}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-legal-primary opacity-50" />
                      <span className="text-legal-primary">{member.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-legal-primary opacity-50" />
                      <span className="text-legal-primary">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-legal-primary opacity-50" />
                      <span className="text-legal-primary">
                        DOB: {new Date(member.dob).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <CreditCard size={16} className="text-legal-primary opacity-50" />
                      <div>
                        <p className="text-xs text-legal-primary opacity-75">PAN</p>
                        <p className="font-semibold text-legal-primary">{member.pan}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard size={16} className="text-legal-primary opacity-50" />
                      <div>
                        <p className="text-xs text-legal-primary opacity-75">Aadhar</p>
                        <p className="font-semibold text-legal-primary">{member.aadhar}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-legal-gold bg-opacity-10 rounded-legal">
                    <p className="text-xs text-legal-primary opacity-75 mb-1">Share in Estate</p>
                    <p className="text-2xl font-header font-bold text-legal-gold">
                      {member.sharePercentage}%
                    </p>
                  </div>

                  <p className="text-sm text-legal-primary opacity-75 mt-4">
                    <span className="font-semibold">Address:</span> {member.address}
                  </p>
                </div>

                <div className="flex gap-2 ml-4">
                  <button className="p-2 hover:bg-legal-light rounded-legal transition-colors" title="Edit">
                    <Edit size={18} className="text-legal-primary" />
                  </button>
                  <button className="p-2 hover:bg-legal-light rounded-legal transition-colors" title="Delete">
                    <Trash2 size={18} className="text-legal-primary opacity-50" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Other Family Members */}
      {otherMembers.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-header font-bold text-legal-primary mb-4">
            Other Family Members
          </h2>
          <div className="space-y-4">
            {otherMembers.map((member) => (
              <div key={member.id} className="card-legal hover:shadow-legal-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-header font-bold text-legal-primary">
                        {member.name}
                      </h3>
                      <span className={`${getRelationshipColor(member.role)} text-legal-cream px-3 py-1 rounded-full text-xs font-semibold`}>
                        {member.role}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm text-legal-primary opacity-75">
                      <span className="flex items-center gap-1">
                        <Phone size={14} />
                        {member.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail size={14} />
                        {member.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button className="p-2 hover:bg-legal-light rounded-legal transition-colors">
                      <Edit size={18} className="text-legal-primary" />
                    </button>
                    <button className="p-2 hover:bg-legal-light rounded-legal transition-colors">
                      <Trash2 size={18} className="text-legal-primary opacity-50" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Family Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-legal-primary bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card-legal max-w-2xl w-full max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-header font-bold text-legal-primary mb-6">
              Add Family Member
            </h2>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-legal-primary mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Sunita Agarwal"
                    className="w-full px-4 py-2 border border-legal-border rounded-legal focus:border-legal-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-legal-primary mb-2">
                    Relationship
                  </label>
                  <select className="w-full px-4 py-2 border border-legal-border rounded-legal focus:border-legal-gold">
                    <option>Spouse</option>
                    <option>Child</option>
                    <option>Parent</option>
                    <option>Sibling</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-legal-primary mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    className="w-full px-4 py-2 border border-legal-border rounded-legal focus:border-legal-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-legal-primary mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2 border border-legal-border rounded-legal focus:border-legal-gold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-legal-primary mb-2">
                  Address
                </label>
                <textarea
                  placeholder="Full address"
                  rows={2}
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
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyPage;
