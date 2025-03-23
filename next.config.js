/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Ensure trailing slashes for better compatibility with Netlify
  trailingSlash: true,
  // Disable server components for static export
  distDir: 'out',
}

module.exports = nextConfig
