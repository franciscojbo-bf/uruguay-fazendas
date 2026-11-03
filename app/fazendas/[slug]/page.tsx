import { getPropriedades, getPropriedade } from '@/lib/sheets'
import { BASE_URL } from '@/lib/config'
import { notFound } from 'next/navigation'
import TypeformButton from '@/components/TypeformButton'

export const revalidate = 300

export async function generateStaticParams() {
  const props = await getPropriedades()
  return props.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = await getPropriedade(params.slug)
  if (!p) return { title: 'Propriedade não encontrada' }

  const desc = `${p.area_ha.toLocaleString('pt-BR')} ha em ${p.departamento}, Uruguai. ${p.coneat_medio > 0 ? `Índice CONEAT médio ${p.coneat_medio}.` : ''} USD ${p.preco_por_ha_usd.toLocaleString('pt-BR')}/ha.`

  return {
    title: `${p.nome} em ${p.departamento}, Uruguai | Benedini Fazendas`,
    description: desc.slice(0, 155),
    alternates: { canonical: `/fazendas/${params.slug}` },
  }
}

function BreadcrumbJsonLd({ nome, slug }: { nome: string; slug: string }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Fazendas', item: `${BASE_URL}/fazendas` },
      { '@type': 'ListItem', position: 3, name: nome, item: `${BASE_URL}/fazendas/${slug}` },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export default async function PropriedadePage({ params }: { params: { slug: string } }) {
  const p = await getPropriedade(params.slug)
  if (!p) notFound()

  const valorTotalFormatado = (p.valor_total_usd / 1_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

  return (
    <main>
      <BreadcrumbJsonLd nome={p.nome} slug={p.slug} />

      {/* Header */}
      <section className="bg-benedini-dark py-16">
        <div className="max-w-7xl mx-auto px-6">
          <a href="/fazendas" className="text-benedini-gold text-sm hover:underline">← Voltar ao portfólio</a>
          <h1 className="font-display text-4xl md:text-5xl text-white mt-6">{p.nome}</h1>
          <p className="text-white/60 text-lg mt-2">{p.departamento}, Uruguai</p>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
            <Kpi label="Área total" valor={`${p.area_ha.toLocaleString('pt-BR')} ha`} />
            {p.coneat_medio > 0 && <Kpi label="Coneat médio" valor={String(p.coneat_medio)} />}
            <Kpi label="Preço por hectare" valor={`USD ${p.preco_por_ha_usd.toLocaleString('pt-BR')}`} destaque />
            <Kpi label="Valor total" valor={`USD ${valorTotalFormatado} mi`} />
          </div>
        </div>
      </section>

      {/* Galeria */}
      {p.fotos.length > 0 && (
        <section className="bg-benedini-card py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {p.fotos.map((foto, i) => (
                <div key={i} className={`overflow-hidden ${i === 0 ? 'col-span-2 row-span-2' : ''}`}>
                  <img src={foto} alt={`${p.nome}, ${p.departamento}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-3 gap-16">
        {/* Coluna principal */}
        <div className="lg:col-span-2 space-y-16">
          {p.descricao && (
            <div>
              <h2 className="font-display text-2xl text-benedini-green">Sobre a propriedade</h2>
              <p className="mt-4 text-benedini-text leading-relaxed">{p.descricao}</p>
            </div>
          )}

          {(p.infraestrutura || p.recursos_hidricos) && (
            <div className="grid md:grid-cols-2 gap-8">
              {p.infraestrutura && (
                <div>
                  <h3 className="font-semibold text-benedini-green text-sm uppercase tracking-wider">Infraestrutura</h3>
                  <p className="mt-2 text-sm text-benedini-muted leading-relaxed">{p.infraestrutura}</p>
                </div>
              )}
              {p.recursos_hidricos && (
                <div>
                  <h3 className="font-semibold text-benedini-green text-sm uppercase tracking-wider">Recursos Hídricos</h3>
                  <p className="mt-2 text-sm text-benedini-muted leading-relaxed">{p.recursos_hidricos}</p>
                </div>
              )}
            </div>
          )}

          {/* Solos */}
          {p.solos.length > 0 && (
            <div>
              <h2 className="font-display text-2xl text-benedini-green">Composição de Solos</h2>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-benedini-green/20">
                      <th className="text-left py-3 pr-4 font-semibold text-benedini-green">Grupo CONEAT</th>
                      <th className="text-center py-3 px-4 font-semibold text-benedini-green">IC</th>
                      <th className="text-right py-3 px-4 font-semibold text-benedini-green">Área (ha)</th>
                      <th className="text-right py-3 px-4 font-semibold text-benedini-green">%</th>
                      <th className="text-left py-3 pl-4 font-semibold text-benedini-green">Aptidão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.solos.map((s, i) => (
                      <tr key={i} className="border-b border-benedini-card">
                        <td className="py-3 pr-4">
                          <span className="bg-benedini-gold/10 text-benedini-gold font-mono text-xs px-2 py-1 rounded">
                            {s.grupo_coneat}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4 font-semibold">{s.ic}</td>
                        <td className="text-right py-3 px-4">{s.area_ha.toLocaleString('pt-BR')}</td>
                        <td className="text-right py-3 px-4 text-benedini-muted">{(s.percentual * 100).toFixed(1)}%</td>
                        <td className="py-3 pl-4 text-benedini-muted">{s.aptidao}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-benedini-green/20 font-semibold">
                      <td className="py-3 pr-4">Total</td>
                      <td className="text-center py-3 px-4 text-benedini-gold">{p.coneat_medio}</td>
                      <td className="text-right py-3 px-4">{p.solos.reduce((s, solo) => s + solo.area_ha, 0).toLocaleString('pt-BR')}</td>
                      <td className="text-right py-3 px-4">100%</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Renda */}
          {p.rendas.length > 0 && (
            <div>
              <h2 className="font-display text-2xl text-benedini-green">Fontes de Renda</h2>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-benedini-green/20">
                      <th className="text-left py-3 pr-4 font-semibold text-benedini-green">Tipo</th>
                      <th className="text-right py-3 px-4 font-semibold text-benedini-green">Área (ha)</th>
                      <th className="text-left py-3 px-4 font-semibold text-benedini-green">Pagamento</th>
                      <th className="text-left py-3 pl-4 font-semibold text-benedini-green">Observação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.rendas.map((r, i) => (
                      <tr key={i} className="border-b border-benedini-card">
                        <td className="py-3 pr-4">
                          <span className="bg-benedini-gold/10 text-benedini-gold font-semibold text-xs uppercase tracking-wider px-2 py-1 rounded">
                            {r.tipo_renda}
                          </span>
                        </td>
                        <td className="text-right py-3 px-4 font-semibold">
                          {r.area_ha > 0 ? r.area_ha.toLocaleString('pt-BR') : 'Sob consulta'}
                        </td>
                        <td className="py-3 px-4 font-semibold">
                          {r.unidade_pagamento ? `${r.valor_por_unidade} ${r.unidade_pagamento}` : 'Sob consulta'}
                        </td>
                        <td className="py-3 pl-4 text-benedini-muted text-xs">
                          {r.observacao || ''}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 bg-benedini-dark p-8 text-white">
            <h3 className="font-display text-xl">Quero conhecer esta propriedade</h3>
            <p className="text-white/60 text-sm mt-2">
              Solicite seu acesso e receba análise técnica, jurídica e financeira detalhada.
            </p>
            <div className="mt-6">
              <TypeformButton
                label="Quero Conhecer Esta Propriedade"
                utmContent={`prop-${p.slug}`}
                propriedade={p.slug}
                className="w-full bg-benedini-gold text-benedini-dark py-3 font-semibold text-sm hover:bg-benedini-gold-light transition min-h-[44px]"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function Kpi({ label, valor, destaque }: { label: string; valor: string; destaque?: boolean }) {
  return (
    <div className="border-l-2 border-benedini-gold/30 pl-4">
      <p className="text-white/50 text-xs uppercase tracking-wider">{label}</p>
      <p className={`font-display text-2xl mt-1 ${destaque ? 'text-benedini-gold' : 'text-white'}`}>{valor}</p>
    </div>
  )
}
