/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for pure static site
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Disable server-side features for static export
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