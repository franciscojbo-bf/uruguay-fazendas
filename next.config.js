/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'drive.google.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'hotsite-uruguai.vercel.app' }],
        destination: 'https://uruguai.benedinifazendas.com.br/:path*',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
