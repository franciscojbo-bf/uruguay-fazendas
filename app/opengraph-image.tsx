import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Terras e Fazendas à Venda no Uruguai | Benedini Fazendas'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#1A2E1A',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <div style={{ color: '#C5A55A', fontSize: 18, fontWeight: 600, letterSpacing: '0.15em', marginBottom: 24 }}>
            BENEDINI FAZENDAS
          </div>
          <div style={{ color: 'white', fontSize: 56, fontWeight: 700, lineHeight: 1.2, maxWidth: 900 }}>
            Terras e Fazendas à Venda no Uruguai
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 24, marginTop: 24, maxWidth: 700 }}>
            Proteção patrimonial e renda em dólar, sem sair do agro.
          </div>
          <div
            style={{
              marginTop: 40,
              backgroundColor: '#C5A55A',
              color: '#1A2E1A',
              padding: '14px 40px',
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            uruguai.benedinifazendas.com.br
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
