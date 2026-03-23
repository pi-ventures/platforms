/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_MYVAULT_API: process.env.NEXT_PUBLIC_MYVAULT_API || 'https://api.myvault.co.in',
    NEXT_PUBLIC_KNOWLEDGE_HUB_API: process.env.NEXT_PUBLIC_KNOWLEDGE_HUB_API || 'https://hub.legalopinion.co.in',
    NEXT_PUBLIC_LEGAL_PARTNER: 'https://www.legalopinion.co.in',
  },
};

module.exports = nextConfig;
