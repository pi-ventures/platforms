/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_APP_NAME: 'TheEquinox.ai',
    NEXT_PUBLIC_MYVAULT_API: 'https://api.myvault.in',
    NEXT_PUBLIC_KNOWLEDGEHUB_API: 'https://api.knowledgehub.ai',
  },
};

module.exports = nextConfig;
