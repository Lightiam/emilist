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
}

module.exports = nextConfig
