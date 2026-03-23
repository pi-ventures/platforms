/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'randomuser.me', 'via.placeholder.com'],
  },
  env: {
    NEXT_PUBLIC_APP_NAME: 'YesBroker',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
    NEXT_PUBLIC_MYVAULT_API: 'https://api.myvault.in',
    NEXT_PUBLIC_KNOWLEDGEHUB_API: 'https://api.knowledgehub.ai',
    NEXT_PUBLIC_MAPS_KEY: 'YOUR_GOOGLE_MAPS_KEY',
  },
}

module.exports = nextConfig
