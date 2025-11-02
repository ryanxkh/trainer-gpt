/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASE_URL || '/app',
  assetPrefix: process.env.ASSETS_PREFIX || '/app',

  images: {
    unoptimized: true, // Required for edge
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  output: 'standalone',
};

module.exports = nextConfig;
