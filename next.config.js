/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Ensure trailing slashes for better compatibility with Netlify
  trailingSlash: true,
  // Use standard output directory for Next.js
  distDir: '.next',
  // Configure static export directory
  exportPathMap: async function() {
    return {
      '/': { page: '/' },
      '/find-job': { page: '/find-job' },
      '/hire-experts': { page: '/hire-experts' },
      '/dashboard': { page: '/dashboard' },
      '/compare': { page: '/compare' },
      '/catalog': { page: '/catalog' },
      '/buy-materials': { page: '/buy-materials' },
    };
  },
}

module.exports = nextConfig
