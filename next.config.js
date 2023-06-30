/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    EXCLUDE_PUBLIC_OFFERS: process.env.EXCLUDE_PUBLIC_OFFERS,
  },
  images: {
    remotePatterns: [],
  },
  output: 'standalone',
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

module.exports = nextConfig;
