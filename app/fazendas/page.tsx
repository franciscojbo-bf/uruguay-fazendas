import { getPropriedades } from '@/lib/sheets'
import PropertyCard from '@/components/PropertyCard'

export const revalidate = 300

export const metadata = {
  title: 'Fazendas à Venda no Uruguai | Benedini Fazendas',
  description: 'Propriedades rurais selecionadas no Uruguai com due diligence técnica e jurídica concluída.',
  alternates: { canonical: '/fazendas' },
}

export default async function FazendasPage() {
  const propriedades = await getPropriedades()
  const disponiveis = propriedades.filter(p => p.status === 'Disponível')
  const outras = propriedades.filter(p => p.status && p.status !== 'Disponível')

  return (
    <main>
      <section className="bg-benedini-dark py-20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-benedini-gold text-sm font-semibold tracking-[0.2em] uppercase">Portfólio</p>
          <h1 className="font-display text-4xl md:text-5xl text-white mt-4">Fazendas no Uruguai</h1>
          <p className="mt-4 text-white/60 max-w-2xl">
            Propriedades selecionadas com due diligence técnica e jurídica. Solos de alta qualidade,
            renda recorrente em dólar e segurança dominial.
          </p>
        </div>
      </section>

      <section className="py-16 bg-benedini-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-6 mb-12 text-sm">
            <div className="bg-white px-5 py-3">
              <span className="text-benedini-muted">Disponíveis:</span>{' '}
              <span className="font-semibold text-benedini-green">{disponiveis.length}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {disponiveis.map((p) => (
              <PropertyCard key={p.slug} propriedade={p} />
            ))}
          </div>

          {outras.length > 0 && (
            <>
              <h2 className="font-display text-2xl text-benedini-green mt-16 mb-8">Outras propriedades</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
                {outras.map((p) => (
                  <PropertyCard key={p.slug} propriedade={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
