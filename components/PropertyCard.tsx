import { Propriedade } from '@/lib/sheets'

const statusStyles: Record<string, string> = {
  'Disponível': 'bg-emerald-600 text-white',
  'Em negociação': 'bg-amber-500 text-white',
  'Vendida': 'bg-red-600 text-white',
}

export default function PropertyCard({ propriedade: p }: { propriedade: Propriedade }) {
  const fotoUrl = p.fotos[0] || '/uruguai-paisagem.jpg'

  return (
    <a href={`/fazendas/${p.slug}`} className="group block bg-white overflow-hidden hover:shadow-lg transition-shadow">
      {/* Imagem */}
      <div className="relative h-48 bg-benedini-card overflow-hidden">
        <img
          src={fotoUrl}
          alt={p.nome}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 ${statusStyles[p.status] || 'bg-gray-500 text-white'}`}>
          {p.status}
        </span>
        <span className="absolute top-3 right-3 bg-benedini-dark/80 text-white text-xs px-2 py-1">
          {p.departamento}
        </span>
      </div>

      {/* Dados */}
      <div className="p-5">
        <h3 className="font-display text-lg text-benedini-green group-hover:text-benedini-gold transition-colors">
          {p.nome}
        </h3>

        <div className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
          <div>
            <p className="text-benedini-muted text-xs">Área</p>
            <p className="font-semibold text-benedini-text">{p.area_ha.toLocaleString('pt-BR')} ha</p>
          </div>
          {p.coneat_medio > 0 && (
            <div>
              <p className="text-benedini-muted text-xs">Coneat Médio</p>
              <p className="font-semibold text-benedini-text">{p.coneat_medio}</p>
            </div>
          )}
          <div>
            <p className="text-benedini-muted text-xs">Preço/ha</p>
            <p className="font-semibold text-benedini-gold">USD {p.preco_por_ha_usd.toLocaleString('pt-BR')}</p>
          </div>
          <div>
            <p className="text-benedini-muted text-xs">Valor total</p>
            <p className="font-semibold text-benedini-text">USD {(p.valor_total_usd / 1_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} mi</p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-benedini-card">
          <p className="text-benedini-gold text-xs font-semibold group-hover:translate-x-1 transition-transform">
            Ver detalhes →
          </p>
        </div>
      </div>
    </a>
  )
}
