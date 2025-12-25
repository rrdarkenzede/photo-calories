/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.openfoodfacts.org', 'world.openfoodfacts.org'],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
}

module.exports = nextConfig