import { ImageResponse } from 'next/og'
import { getPropriedade } from '@/lib/sheets'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export const alt = 'Propriedade rural no Uruguai | Benedini Fazendas'

export default async function Image({ params }: { params: { slug: string } }) {
  const p = await getPropriedade(params.slug)

  const nome = p?.nome || 'Propriedade'
  const depto = p?.departamento || 'Uruguai'
  const area = p ? `${p.area_ha.toLocaleString('pt-BR')} ha` : ''
  const preco = p ? `USD ${p.preco_por_ha_usd.toLocaleString('pt-BR')}/ha` : ''

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#1A2E1A',
          padding: '60px',
        }}
      >
        <div style={{ color: '#C5A55A', fontSize: 16, fontWeight: 600, letterSpacing: '0.15em' }}>
          BENEDINI FAZENDAS · PORTFÓLIO URUGUAI
        </div>
        <div style={{ color: 'white', fontSize: 52, fontWeight: 700, marginTop: 20, lineHeight: 1.2 }}>
          {nome}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 28, marginTop: 12 }}>
          {depto}, Uruguai
        </div>
        <div style={{ display: 'flex', gap: 40, marginTop: 40 }}>
          {area && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>ÁREA TOTAL</div>
              <div style={{ color: '#C5A55A', fontSize: 32, fontWeight: 700, marginTop: 4 }}>{area}</div>
            </div>
          )}
          {preco && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>PREÇO POR HECTARE</div>
              <div style={{ color: '#C5A55A', fontSize: 32, fontWeight: 700, marginTop: 4 }}>{preco}</div>
            </div>
          )}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 16, marginTop: 'auto' }}>
          uruguai.benedinifazendas.com.br
        </div>
      </div>
    ),
    { ...size }
  )
}
