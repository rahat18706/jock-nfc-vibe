/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      // Proxy API requests to Express backend
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/:path*`,
      },
      // NFC redirect - proxy to backend for speed
      {
        source: '/s/:cardId',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/s/:cardId`,
      },
    ];
  },
};

module.exports = nextConfig;
