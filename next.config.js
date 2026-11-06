/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV !== 'production'

// Origens externas usadas pelo site:
// - Google Drive / googleusercontent: fotos e mapas das fazendas (vindos da planilha)
// - Google Fonts: Playfair Display + Inter (globals.css)
// - Google Analytics 4 / Tag Manager: GA condicional (NEXT_PUBLIC_GA_ID)
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://drive.google.com https://*.googleusercontent.com https://*.google-analytics.com https://*.googletagmanager.com",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
]

const nextConfig = {
  poweredByHeader: false,
  // As imagens usam <img> direto (não next/image), então o otimizador de
  // imagens não precisa aceitar hosts externos.
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      // E-book: só é oferecido na tela de obrigado do /hotline, não deve aparecer no Google
      { source: '/e-book-uruguai.pdf', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    ]
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
