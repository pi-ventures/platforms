'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Building2, TrendingUp, FileText, Zap, Shield, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-vault-black via-vault-charcoal to-vault-black overflow-hidden">
      {/* Navigation */}
      <nav className="border-b border-vault-gold/20 backdrop-blur-md sticky top-0 z-50">
        <div className="container-vault flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-vault-gold to-vault-gold-light flex items-center justify-center">
              <svg className="w-6 h-6 text-vault-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-2xl font-playfair font-bold text-vault-gold-light">MyVault</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-vault-gold transition-colors">
              Dashboard
            </Link>
            <button className="btn-vault">Sign In</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 right-20 w-72 h-72 bg-vault-gold rounded-full mix-blend-screen filter blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-vault-gold/30 rounded-full mix-blend-screen filter blur-3xl"></div>
        </div>

        <div className="container-vault relative z-10 text-center">
          <h1 className="text-6xl font-playfair font-800 mb-6 leading-tight">
            Your Complete Wealth
            <br />
            <span className="text-vault-gold-light">Universe, Unified</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Connect your real estate portfolio, stock investments, and estate planning in one luxurious vault. 
            Powered by YesBroker, TheEquinox.ai, and MyWills.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard" className="btn-vault flex items-center gap-2">
              Enter Vault <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="btn-vault-outline">Learn More</button>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 px-4 border-t border-vault-gold/20">
        <div className="container-vault">
          <h2 className="text-4xl font-playfair font-700 text-center mb-16">
            <span className="text-vault-gold">Three Platforms,</span> One Vault
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* YesBroker */}
            <div className="card-vault group hover:shadow-gold">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-vault-gold/20 to-vault-gold-light/20 flex items-center justify-center mb-4 group-hover:from-vault-gold/30 group-hover:to-vault-gold-light/30 transition-all">
                <Building2 className="w-6 h-6 text-vault-gold-light" />
              </div>
              <h3 className="text-xl font-playfair font-700 text-vault-gold-light mb-3">Real Estate Hub</h3>
              <p className="text-gray-400 mb-4">Synced from YesBroker - Track all your properties, valuations, and rental income in real-time.</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>✓ Property Portfolio Tracking</li>
                <li>✓ Valuation Updates</li>
                <li>✓ Rental Income</li>
              </ul>
            </div>

            {/* TheEquinox.ai */}
            <div className="card-vault group hover:shadow-gold">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-vault-gold/20 to-vault-gold-light/20 flex items-center justify-center mb-4 group-hover:from-vault-gold/30 group-hover:to-vault-gold-light/30 transition-all">
                <TrendingUp className="w-6 h-6 text-vault-gold-light" />
              </div>
              <h3 className="text-xl font-playfair font-700 text-vault-gold-light mb-3">Investment Portfolio</h3>
              <p className="text-gray-400 mb-4">Synced from TheEquinox.ai - Monitor stocks, P&L, and market performance effortlessly.</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>✓ Stock Holdings</li>
                <li>✓ P&L Tracking</li>
                <li>✓ Sector Analysis</li>
              </ul>
            </div>

            {/* MyWills */}
            <div className="card-vault group hover:shadow-gold">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-vault-gold/20 to-vault-gold-light/20 flex items-center justify-center mb-4 group-hover:from-vault-gold/30 group-hover:to-vault-gold-light/30 transition-all">
                <FileText className="w-6 h-6 text-vault-gold-light" />
              </div>
              <h3 className="text-xl font-playfair font-700 text-vault-gold-light mb-3">Estate Planning</h3>
              <p className="text-gray-400 mb-4">Synced from MyWills via legalopinion.co.in - Manage wills, beneficiaries, and legal documents.</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>✓ Will Management</li>
                <li>✓ Beneficiary Tracking</li>
                <li>✓ Legal Status</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 border-t border-vault-gold/20">
        <div className="container-vault">
          <h2 className="text-4xl font-playfair font-700 text-center mb-16">
            <span className="text-vault-gold">Premium Features</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="card-vault-dark flex gap-4">
              <Zap className="w-8 h-8 text-vault-gold flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-playfair font-700 text-vault-gold-light mb-2">Sync Engine</h3>
                <p className="text-gray-400">Real-time synchronization with YesBroker, TheEquinox.ai, and MyWills for always up-to-date data.</p>
              </div>
            </div>

            <div className="card-vault-dark flex gap-4">
              <BarChart3 className="w-8 h-8 text-vault-gold flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-playfair font-700 text-vault-gold-light mb-2">Wealth Analytics</h3>
                <p className="text-gray-400">Advanced analytics with diversification scores, risk profiles, and growth tracking.</p>
              </div>
            </div>

            <div className="card-vault-dark flex gap-4">
              <FileText className="w-8 h-8 text-vault-gold flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-playfair font-700 text-vault-gold-light mb-2">Estate Planning</h3>
                <p className="text-gray-400">Integrated with legalopinion.co.in for comprehensive will and estate management.</p>
              </div>
            </div>

            <div className="card-vault-dark flex gap-4">
              <Shield className="w-8 h-8 text-vault-gold flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-playfair font-700 text-vault-gold-light mb-2">KnowledgeHub Integration</h3>
                <p className="text-gray-400">Send master analytics to KnowledgeHub.ai for AI-powered wealth insights.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 px-4 border-t border-vault-gold/20">
        <div className="container-vault">
          <h2 className="text-3xl font-playfair font-700 text-center mb-12">
            <span className="text-vault-gold">Trusted Partners</span>
          </h2>

          <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-20">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto rounded-lg bg-vault-charcoal border-2 border-vault-gold/30 flex items-center justify-center mb-4 hover:border-vault-gold/60 transition-colors">
                <Building2 className="w-12 h-12 text-vault-gold" />
              </div>
              <p className="font-semibold text-vault-gold">YesBroker</p>
              <p className="text-sm text-gray-500">Real Estate</p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 mx-auto rounded-lg bg-vault-charcoal border-2 border-vault-gold/30 flex items-center justify-center mb-4 hover:border-vault-gold/60 transition-colors">
                <TrendingUp className="w-12 h-12 text-vault-gold" />
              </div>
              <p className="font-semibold text-vault-gold">TheEquinox.ai</p>
              <p className="text-sm text-gray-500">Investments</p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 mx-auto rounded-lg bg-vault-charcoal border-2 border-vault-gold/30 flex items-center justify-center mb-4 hover:border-vault-gold/60 transition-colors">
                <FileText className="w-12 h-12 text-vault-gold" />
              </div>
              <p className="font-semibold text-vault-gold">MyWills (iWills)</p>
              <p className="text-sm text-gray-500">Estate Planning</p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 mx-auto rounded-lg bg-vault-charcoal border-2 border-vault-gold/30 flex items-center justify-center mb-4 hover:border-vault-gold/60 transition-colors">
                <Zap className="w-12 h-12 text-vault-gold" />
              </div>
              <p className="font-semibold text-vault-gold">legalopinion.co.in</p>
              <p className="text-sm text-gray-500">Legal Services</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 border-t border-vault-gold/20">
        <div className="container-vault">
          <h2 className="text-4xl font-playfair font-700 text-center mb-16">
            <span className="text-vault-gold">Simple Pricing</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Personal Plan */}
            <div className="card-vault">
              <h3 className="text-2xl font-playfair font-700 text-vault-gold-light mb-2">Personal</h3>
              <p className="text-gray-500 mb-6">For individuals managing their wealth</p>
              <div className="mb-6">
                <span className="text-4xl font-playfair font-700 text-vault-gold">Free</span>
              </div>
              <button className="w-full btn-vault-outline mb-6">Get Started</button>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>✓ Real Estate Dashboard</li>
                <li>✓ Portfolio Tracking</li>
                <li>✓ Basic Analytics</li>
                <li>✗ KnowledgeHub Integration</li>
              </ul>
            </div>

            {/* Wealth Plan */}
            <div className="card-vault-premium relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="badge-vault">POPULAR</span>
              </div>
              <h3 className="text-2xl font-playfair font-700 text-vault-gold-light mb-2">Wealth</h3>
              <p className="text-gray-500 mb-6">For serious wealth management</p>
              <div className="mb-6">
                <span className="text-4xl font-playfair font-700 text-vault-gold">₹999</span>
                <span className="text-gray-500">/month</span>
              </div>
              <button className="w-full btn-vault mb-6">Subscribe Now</button>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>✓ All Personal Features</li>
                <li>✓ Advanced Analytics</li>
                <li>✓ Estate Planning Tools</li>
                <li>✓ KnowledgeHub Integration</li>
              </ul>
            </div>

            {/* Family Office Plan */}
            <div className="card-vault">
              <h3 className="text-2xl font-playfair font-700 text-vault-gold-light mb-2">Family Office</h3>
              <p className="text-gray-500 mb-6">For multi-generational wealth</p>
              <div className="mb-6">
                <span className="text-4xl font-playfair font-700 text-vault-gold">₹4,999</span>
                <span className="text-gray-500">/month</span>
              </div>
              <button className="w-full btn-vault-outline mb-6">Contact Sales</button>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>✓ All Wealth Features</li>
                <li>✓ Multi-user Access</li>
                <li>✓ Custom Reports</li>
                <li>✓ Dedicated Support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 border-t border-vault-gold/20">
        <div className="container-vault text-center">
          <h2 className="text-4xl font-playfair font-700 mb-6">
            Ready to Unite Your Wealth?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of high-net-worth individuals and families using MyVault to manage their complete wealth universe.
          </p>
          <Link href="/dashboard" className="btn-vault inline-flex items-center gap-2 text-lg">
            Enter Your Vault <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-vault-gold/20 py-12 px-4">
        <div className="container-vault">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-vault-gold to-vault-gold-light flex items-center justify-center">
                  <svg className="w-5 h-5 text-vault-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="font-playfair font-bold text-vault-gold-light">MyVault</span>
              </div>
              <p className="text-gray-500 text-sm">Your complete wealth universe, unified.</p>
            </div>
            <div>
              <h4 className="font-semibold text-vault-gold-light mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-vault-gold transition">Dashboard</a></li>
                <li><a href="#" className="hover:text-vault-gold transition">Features</a></li>
                <li><a href="#" className="hover:text-vault-gold transition">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-vault-gold-light mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-vault-gold transition">About</a></li>
                <li><a href="#" className="hover:text-vault-gold transition">Blog</a></li>
                <li><a href="#" className="hover:text-vault-gold transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-vault-gold-light mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-vault-gold transition">Privacy</a></li>
                <li><a href="#" className="hover:text-vault-gold transition">Terms</a></li>
                <li><a href="#" className="hover:text-vault-gold transition">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-vault-gold/20 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2026 MyVault. All rights reserved. Powered by YesBroker, TheEquinox.ai, and MyWills.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
