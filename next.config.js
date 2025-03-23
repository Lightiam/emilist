/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Disable server components for static export
  experimental: {
    appDir: true,
  },
  // Ensure trailing slashes for better compatibility with Netlify
  trailingSlash: true,
}

module.exports = nextConfig
