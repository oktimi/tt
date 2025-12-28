/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'valuo.la5.org' },
    ],
  },
}

module.exports = nextConfig
