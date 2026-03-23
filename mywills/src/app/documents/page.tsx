'use client';

import React, { useState } from 'react';
import { Upload, Download, Trash2, Lock, FileText, Calendar } from 'lucide-react';

const DocumentsPage = () => {
  const [documents] = useState([
    {
      id: 1,
      name: 'Will Document',
      type: 'PDF',
      size: '2.5 MB',
      uploadedDate: '2024-01-15',
      status: 'verified',
    },
    {
      id: 2,
      name: 'Property Deed - Mumbai Flat',
      type: 'PDF',
      size: '1.8 MB',
      uploadedDate: '2024-01-15',
      status: 'verified',
    },
    {
      id: 3,
      name: 'Property Deed - Pune Plot',
      type: 'PDF',
      size: '2.1 MB',
      uploadedDate: '2024-01-15',
      status: 'verified',
    },
    {
      id: 4,
      name: 'Mutual Fund Statements',
      type: 'PDF',
      size: '890 KB',
      uploadedDate: '2024-01-10',
      status: 'verified',
    },
    {
      id: 5,
      name: 'Bank FD Certificates',
      type: 'PDF',
      size: '1.2 MB',
      uploadedDate: '2024-01-10',
      status: 'verified',
    },
  ]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-header font-bold text-legal-primary mb-2">
            Documents
          </h1>
          <p className="text-legal-primary opacity-75">
            Securely store and manage all your important legal documents
          </p>
        </div>
        <button className="btn-legal-primary flex items-center gap-2">
          <Upload size={20} />
          Upload Document
        </button>
      </div>

      {/* Security Notice */}
      <div className="card-legal mb-8 bg-legal-gold bg-opacity-10 border-2 border-legal-gold border-opacity-30 flex items-start gap-4">
        <Lock className="text-legal-gold flex-shrink-0 mt-1" size={24} />
        <div>
          <p className="font-semibold text-legal-primary mb-1">
            End-to-End Encrypted Storage
          </p>
          <p className="text-sm text-legal-primary opacity-75">
            All documents are encrypted and stored securely. Access is restricted to you and authorized legal professionals only.
          </p>
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {documents.map((doc) => (
          <div key={doc.id} className="card-legal hover:shadow-legal-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 bg-legal-primary bg-opacity-10 rounded-legal flex items-center justify-center flex-shrink-0">
                  <FileText className="text-legal-primary" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-legal-primary mb-1">
                    {doc.name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-legal-primary opacity-75">
                    <span>{doc.type} • {doc.size}</span>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{new Date(doc.uploadedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="badge-legal">Verified</span>
                <button className="p-2 hover:bg-legal-light rounded-legal transition-colors">
                  <Download size={18} className="text-legal-primary" />
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
  );
};

export default DocumentsPage;
