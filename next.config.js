/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Cloudflare Pages
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Configure trailing slashes
  trailingSlash: true,
  
  // Environment variables available to the client
  env: {
    SITE_NAME: process.env.SITE_NAME,
    SITE_URL: process.env.SITE_URL,
  },
  
  // Configure redirects if needed
  async redirects() {
    return [
      {
        source: '/blog/:path*',
        destination: '/content/post/:path*',
        permanent: true,
      },
    ];
  },
  
  // Configure headers for better performance
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, stale-while-revalidate=60',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 