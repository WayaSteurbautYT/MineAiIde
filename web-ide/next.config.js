/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Environment variables for deployment
  env: {
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    FIREBASE_CONFIG: process.env.FIREBASE_CONFIG,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  },
  
  // API routes for backend functionality
  async rewrites() {
    return [
      {
        source: '/api/agent/:path*',
        destination: '/api/agent/:path*',
      },
      {
        source: '/api/minecraft/:path*',
        destination: '/api/minecraft/:path*',
      },
      {
        source: '/api/projects/:path*',
        destination: '/api/projects/:path*',
      }
    ];
  },
  
  // Enable experimental features
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['@vercel/node'],
  },
  
  // Headers for security and CORS
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
