/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable API routes for development (admin dashboard)
  // output: 'export', // Commented out for development
  
  // Keep image optimization disabled for consistency
  images: {
    unoptimized: true,
  },
  
  // Keep trailing slash for consistency
  trailingSlash: true,
  
  // Configure headers for static assets
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 