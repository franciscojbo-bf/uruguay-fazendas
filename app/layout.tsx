import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import { BASE_URL, INSTAGRAM_URL, INSTAGRAM_HANDLE } from '@/lib/config'
import { safeJsonLd } from '@/lib/jsonld'
import AgendaBanner from '@/components/AgendaBanner'
import UtmCapture from '@/components/UtmCapture'
import HotlineButton from '@/components/HotlineButton'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'Terras e Fazendas à Venda no Uruguai | Benedini Fazendas',
  description: 'Fazendas selecionadas no Uruguai com segurança jurídica, renda de arrendamento em dólar e valorização. Proteção patrimonial sem sair do agro.',
  alternates: { canonical: '/' },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Terras e Fazendas à Venda no Uruguai | Benedini Fazendas',
    description: 'Proteção patrimonial e renda em dólar, sem sair do agro.',
    url: BASE_URL,
    siteName: 'Benedini Fazendas',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

function JsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Benedini Fazendas',
    url: BASE_URL,
    logo: `${BASE_URL}/logo-benedini-branco.svg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Rua Dr. João Gomes Rocha, 635',
      addressLocality: 'Ribeirão Preto',
      addressRegion: 'SP',
      postalCode: '14020-550',
      addressCountry: 'BR',
    },
    sameAs: [
      INSTAGRAM_URL,
      'https://benedinifazendas.com.br',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  return (
    <html lang="pt-BR">
      <head>
        <JsonLd />
      </head>
      <body className="antialiased">
        <UtmCapture />
        <header className="sticky top-0 z-50">
          <AgendaBanner />
          <Nav />
        </header>
        {children}
        <Footer />
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  )
}

function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function Nav() {
  return (
    <nav className="bg-benedini-dark/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/">
          <img src="/logo-benedini-branco.svg" alt="Benedini Fazendas" className="h-14 w-auto" />
        </a>
        <div className="hidden md:flex items-center gap-8 text-sm text-white/80">
          <a href="/#por-que-uruguai" className="hover:text-benedini-gold transition">Por que o Uruguai</a>
          <a href="/#ciclo" className="hover:text-benedini-gold transition">Ciclo de Valorização</a>
          <a href="/fazendas" className="hover:text-benedini-gold transition">Fazendas</a>
          <a href="/#quem-somos" className="hover:text-benedini-gold transition">Quem Somos</a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Instagram ${INSTAGRAM_HANDLE}`}
            className="hover:text-benedini-gold transition"
          >
            <InstagramIcon />
          </a>
          <HotlineButton
            label="Fale Conosco"
            utmContent="menu"
            className="bg-benedini-gold text-benedini-dark px-5 py-2 text-sm font-semibold hover:bg-benedini-gold-light transition"
          />
        </div>
      </div>
    </nav>
  )
}

function Footer() {
  return (
    <footer className="bg-benedini-dark text-white/60 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <img src="/logo-benedini-branco.svg" alt="Benedini Fazendas" className="h-14 w-auto" />
            <p className="mt-2 text-sm">Mais de 60 anos intermediando terras no Brasil e no Uruguai.</p>
          </div>
          <div className="text-sm">
            <p>Rua Dr. João Gomes Rocha, 635</p>
            <p>Jd. Irajá, Ribeirão Preto/SP</p>
            <p>CEP 14.020-550</p>
          </div>
          <div className="text-sm space-y-2">
            <a href="https://benedinifazendas.com.br" className="block hover:text-benedini-gold transition">benedinifazendas.com.br</a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram ${INSTAGRAM_HANDLE}`}
              className="flex items-center gap-2 hover:text-benedini-gold transition"
            >
              <InstagramIcon />
              <span>Siga {INSTAGRAM_HANDLE} no Instagram</span>
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/10 text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} Benedini Fazendas. Todos os direitos reservados.</p>
          <p className="mt-1">Este site apresenta informações gerais sobre oportunidades de investimento em terras rurais no Uruguai e não constitui oferta, recomendação ou solicitação de investimento.</p>
        </div>
      </div>
    </footer>
  )
}
