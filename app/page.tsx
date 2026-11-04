import { getPropriedades } from '@/lib/sheets'
import PropertyCard from '@/components/PropertyCard'
import AgendaReservada from '@/components/AgendaReservada'
import HotlineButton from '@/components/HotlineButton'

export const revalidate = 300

function ImageDivider({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-64 md:h-80 overflow-hidden">
      <img src={src} alt={alt} className="w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-benedini-dark/20" />
    </div>
  )
}

export default async function Home() {
  const propriedades = await getPropriedades()
  const destaques = propriedades.filter(p => p.status === 'Disponível').slice(0, 4)

  return (
    <main>
      <Hero />
      <AgendaReservada />
      <PorQueUruguai />
      <ImageDivider src="/uruguai-paisagem.jpg" alt="Paisagem rural do Uruguai" />
      <Comparativo />
      <CicloValorizacao />
      <Metodologia />
      <DestaquesFazendas propriedades={destaques} />
      <ImageDivider src="/uruguai-gado.jpg" alt="Campo uruguaio com gado" />
      <QuemSomos />
      <ImageDivider src="/uruguai-campo-2.jpg" alt="Campos do interior do Uruguai" />
      <Contato />
    </main>
  )
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-benedini-dark">
      <div className="absolute inset-0">
        <img src="/hero-campo.jpg" alt="Paisagem de campo no Uruguai ao pôr do sol" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-benedini-dark/90 via-benedini-green/80 to-benedini-dark/90" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <p className="text-benedini-gold text-sm font-semibold tracking-[0.25em] uppercase mb-6">
          Benedini Fazendas · Uruguai
        </p>
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-white leading-tight max-w-4xl">
          Fazendas à venda no Uruguai
        </h1>
        <p className="mt-6 font-display text-2xl md:text-3xl text-benedini-gold/90 italic max-w-3xl">
          Proteção patrimonial e renda em dólar, sem sair do agro.
        </p>
        <p className="mt-8 text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed">
          Ambiente institucional de país desenvolvido, segurança jurídica consolidada e um novo ciclo
          de valorização em formação. Conheça as oportunidades selecionadas pela Benedini Fazendas.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <a href="/fazendas" className="bg-benedini-gold text-benedini-dark px-8 py-4 font-semibold text-center hover:bg-benedini-gold-light transition">
            Ver fazendas disponíveis
          </a>
          <HotlineButton
            label="Falar com um especialista"
            utmContent="hero"
            className="border border-white/30 text-white px-8 py-4 font-semibold hover:border-benedini-gold hover:text-benedini-gold transition"
          />
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { valor: 'BBB+', label: 'Grau de investimento', sub: 'Tripla classificação' },
            { valor: '1º', label: 'Menor risco-país', sub: 'América Latina' },
            { valor: 'USD', label: 'Economia dolarizada', sub: 'Terra em dólar' },
            { valor: '3%+', label: 'Renda anual', sub: 'Arrendamento em USD' },
          ].map((item) => (
            <div key={item.valor} className="border-l-2 border-benedini-gold/40 pl-4">
              <p className="text-benedini-gold font-display text-3xl">{item.valor}</p>
              <p className="text-white text-sm font-medium mt-1">{item.label}</p>
              <p className="text-white/50 text-xs mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PorQueUruguai() {
  const fundamentos = [
    {
      indicador: 'BBB+',
      titulo: 'Grau de investimento',
      descricao: 'Pelas três principais agências, único país da América do Sul com tripla classificação.',
      fonte: 'Moody\'s, S&P, Fitch (2024)',
    },
    {
      indicador: '1º',
      titulo: 'Menor risco-país',
      descricao: 'O menor EMBI da América Latina, à frente de Brasil, México e Colômbia.',
      fonte: 'J.P. Morgan EMBI',
    },
    {
      indicador: '1º',
      titulo: 'Democracia da região',
      descricao: 'Líder em índices de democracia, transparência e baixa corrupção na América Latina.',
      fonte: 'Transparency Int\'l; Economist Democracy Index',
    },
    {
      indicador: 'USD',
      titulo: 'Economia dolarizada',
      descricao: 'Livre fluxo de capitais, sem controle cambial. Terra negociada em dólar.',
      fonte: '',
    },
  ]

  return (
    <section id="por-que-uruguai" className="py-24 bg-benedini-cream">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-benedini-gold text-sm font-semibold tracking-[0.2em] uppercase">Fundamentos Institucionais</p>
        <h2 className="font-display text-3xl md:text-5xl text-benedini-green mt-4 max-w-3xl">
          A democracia mais estável e o menor risco-país da região
        </h2>

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {fundamentos.map((f) => (
            <div key={f.titulo} className="bg-white p-8 border-t-4 border-benedini-gold/30 hover:border-benedini-gold transition-colors">
              <p className="font-display text-4xl text-benedini-gold">{f.indicador}</p>
              <p className="font-semibold text-benedini-green mt-3">{f.titulo}</p>
              <p className="text-benedini-muted text-sm mt-2 leading-relaxed">{f.descricao}</p>
              {f.fonte && <p className="text-xs text-benedini-muted/60 mt-4">{f.fonte}</p>}
            </div>
          ))}
        </div>

        <p className="mt-12 text-lg text-benedini-text max-w-4xl leading-relaxed">
          Para o investidor brasileiro, o Uruguai oferece o raro alinhamento entre um ativo real defensivo
          e um ambiente institucional de país desenvolvido, sem o prêmio de risco político que penaliza
          os demais mercados emergentes de terra na região.
        </p>
      </div>
    </section>
  )
}

function Comparativo() {
  const linhas = [
    { driver: 'Moeda de negociação', uy: 'Dólar (USD)', br: 'Real (volatilidade cambial)' },
    { driver: 'Preço do hectare', uy: '~USD 4.000 a 8.000', br: '~USD 12.000' },
    { driver: 'Rentabilidade anual', uy: '3,0% a 4,0%', br: '2,0% a 2,5%' },
    { driver: 'Segurança jurídica fundiária', uy: 'Título federal único', br: 'Sobreposições e litígios' },
    { driver: 'Reserva legal / vegetação nativa', uy: 'Inexistente', br: '20% a 80% + APP' },
    { driver: 'Reforma agrária / invasões', uy: 'Inexistente', br: 'Presente' },
    { driver: 'Tributação para investidor BR', uy: 'Convênio anti-bitributação', br: 'Tributação integral' },
  ]

  return (
    <section className="py-24 bg-benedini-dark">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-benedini-gold text-sm font-semibold tracking-[0.2em] uppercase">Comparativo de Mercado</p>
        <h2 className="font-display text-3xl md:text-4xl text-white mt-4 max-w-3xl">
          Um mercado que entrega segurança, renda e valorização ao mesmo tempo
        </h2>

        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-4 pr-6 text-white/60 text-sm font-medium w-1/3">Driver de decisão</th>
                <th className="text-left py-4 px-6 text-benedini-gold text-sm font-semibold w-1/3">Uruguai</th>
                <th className="text-left py-4 pl-6 text-white/40 text-sm font-medium w-1/3">Brasil</th>
              </tr>
            </thead>
            <tbody>
              {linhas.map((l) => (
                <tr key={l.driver} className="border-b border-white/10">
                  <td className="py-4 pr-6 text-white/80 text-sm">{l.driver}</td>
                  <td className="py-4 px-6 text-white font-medium text-sm">{l.uy}</td>
                  <td className="py-4 pl-6 text-white/40 text-sm">{l.br}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-xs text-white/30">Fonte: DIEA/MGAP 2025; comparativo elaborado pela Benedini Fazendas.</p>
      </div>
    </section>
  )
}

function CicloValorizacao() {
  return (
    <section id="ciclo" className="py-24 bg-benedini-cream">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-benedini-gold text-sm font-semibold tracking-[0.2em] uppercase">Ciclo de Valorização</p>
        <h2 className="font-display text-3xl md:text-5xl text-benedini-green mt-4 max-w-3xl">
          Novo ciclo de valorização em formação
        </h2>
        <p className="mt-4 text-benedini-muted max-w-2xl">
          O timing de entrada é o principal driver de retorno em terra. O mercado uruguaio está no início de um novo ciclo.
        </p>

        <div className="mt-16 grid md:grid-cols-3 gap-0">
          <div className="bg-benedini-green p-8 md:p-10">
            <p className="text-benedini-gold text-xs font-semibold tracking-[0.2em] uppercase">Ciclo de Valorização</p>
            <p className="text-white/60 text-sm mt-1">2003 a 2014</p>
            <p className="font-display text-4xl md:text-5xl text-benedini-gold/80 mt-6">8x</p>
            <p className="text-white text-lg mt-1">em 12 anos</p>
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-white/60 text-sm leading-relaxed">
                Boom das commodities (soja, carne, arroz) e chegada de grandes grupos. O preço do hectare valorizou 20,5% a.a.
              </p>
            </div>
          </div>

          <div className="bg-benedini-green/80 p-8 md:p-10">
            <p className="text-benedini-gold text-xs font-semibold tracking-[0.2em] uppercase">Período de Acumulação</p>
            <p className="text-white/60 text-sm mt-1">2015 a 2025</p>
            <p className="font-display text-4xl md:text-5xl text-white/40 mt-6">0,55%</p>
            <p className="text-white text-lg mt-1">a.a.</p>
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-white/60 text-sm leading-relaxed">
                Consolidação produtiva, profissionalização do manejo, desenvolvimento logístico e maturação dos contratos de arrendamento em dólar.
              </p>
            </div>
          </div>

          <div className="bg-benedini-dark p-8 md:p-10 ring-2 ring-benedini-gold/50 relative">
            <div className="absolute top-4 right-4 bg-benedini-gold text-benedini-dark text-xs font-bold px-3 py-1">AGORA</div>
            <p className="text-benedini-gold text-xs font-semibold tracking-[0.2em] uppercase">Novo Ciclo</p>
            <p className="text-white/60 text-sm mt-1">2026 →</p>
            <p className="font-display text-4xl md:text-5xl text-benedini-gold mt-6 italic">Em</p>
            <p className="font-display text-4xl md:text-5xl text-benedini-gold italic">Formação</p>
            <div className="mt-6 pt-6 border-t border-benedini-gold/20">
              <p className="text-white/70 text-sm leading-relaxed">
                Valorização impulsionada pela segurança alimentar global, migração de capital internacional,
                instabilidade política e insegurança jurídica brasileira, e valores abaixo da média regional.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Metodologia() {
  const criterios = [
    { parametro: 'Qualidade do solo', criterio: 'Aptidão agrícola com potencial de conversão', alvo: 'Coneat ≥ 100' },
    { parametro: 'Tamanho', criterio: 'Escala ideal para governança e liquidez', alvo: '500 a 2.500 ha' },
    { parametro: 'Renda recorrente', criterio: 'Fluxo previsível superior à renda fixa local', alvo: '> 3% a.a. em USD' },
    { parametro: 'Recursos hídricos', criterio: 'Mitigação de risco climático', alvo: 'Água + irrigação' },
    { parametro: 'Titulação', criterio: 'Cadeia dominial limpa, validada juridicamente', alvo: 'Sem ônus' },
  ]

  return (
    <section className="py-24 bg-benedini-card">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-benedini-gold text-sm font-semibold tracking-[0.2em] uppercase">Metodologia</p>
        <h2 className="font-display text-3xl md:text-4xl text-benedini-green mt-4 max-w-3xl">
          Uma metodologia própria para selecionar os melhores ativos
        </h2>

        <div className="mt-12 grid gap-4">
          {criterios.map((c) => (
            <div key={c.parametro} className="bg-white flex flex-col md:flex-row md:items-center p-6 gap-4">
              <p className="font-semibold text-benedini-green w-48 shrink-0">{c.parametro}</p>
              <p className="text-benedini-muted text-sm flex-1">{c.criterio}</p>
              <p className="text-benedini-gold font-semibold text-sm shrink-0">{c.alvo}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm text-benedini-muted max-w-3xl">
          Cada propriedade passa por due diligence técnica, jurídica e produtiva, com apoio de referências
          jurídicas e fiscais uruguaias de primeira linha.
        </p>
      </div>
    </section>
  )
}

function DestaquesFazendas({ propriedades }: { propriedades: Awaited<ReturnType<typeof getPropriedades>> }) {
  return (
    <section className="py-24 bg-benedini-cream">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-benedini-gold text-sm font-semibold tracking-[0.2em] uppercase">Portfólio</p>
        <h2 className="font-display text-3xl md:text-4xl text-benedini-green mt-4">
          Fazendas selecionadas
        </h2>
        <p className="mt-2 text-benedini-muted">Com due diligence técnica e jurídica concluída.</p>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {propriedades.map((p) => (
            <PropertyCard key={p.slug} propriedade={p} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <a href="/fazendas" className="inline-block bg-benedini-green text-white px-8 py-4 font-semibold hover:bg-benedini-dark transition">
            Ver todas as fazendas →
          </a>
        </div>
      </div>
    </section>
  )
}

function QuemSomos() {
  return (
    <section id="quem-somos" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-benedini-gold text-sm font-semibold tracking-[0.2em] uppercase">Quem Somos</p>
        <h2 className="font-display text-3xl md:text-5xl text-benedini-green mt-4">
          Mais de 60 anos lendo a terra
        </h2>

        <div className="mt-12 relative h-72 md:h-96 overflow-hidden">
          <img src="/uruguai-rural.jpg" alt="Paisagem rural do Uruguai com campos verdes" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-16">
          <div>
            <p className="text-benedini-text leading-relaxed">
              A Benedini Fazendas acumula mais de 60 anos de atuação no agronegócio brasileiro, com forte presença
              em São Paulo, Minas Gerais, Goiás, Mato Grosso e Mato Grosso do Sul. Desde 2024, aplica a mesma
              metodologia de captação seletiva e due diligence rigorosa na seleção de ativos rurais no Uruguai.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6">
              {[
                { valor: '50+', label: 'propriedades visitadas no Uruguai' },
                { valor: '2', label: 'países de atuação' },
                { valor: '1mi+', label: 'hectares intermediados' },
              ].map((s) => (
                <div key={s.valor}>
                  <p className="font-display text-3xl text-benedini-gold">{s.valor}</p>
                  <p className="text-xs text-benedini-muted mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div />
        </div>
      </div>
    </section>
  )
}

function Contato() {
  return (
    <section id="contato" className="py-24 bg-benedini-dark">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <p className="text-benedini-gold text-sm font-semibold tracking-[0.2em] uppercase">Próximo Passo</p>
        <h2 className="font-display text-3xl md:text-4xl text-white mt-4">
          Pronto para conhecer as oportunidades?
        </h2>
        <p className="mt-4 text-white/60">
          Fale com a Benedini Fazendas e receba o dossiê completo das propriedades disponíveis no Uruguai.
        </p>

        <div className="mt-12">
          <HotlineButton
            label="Solicitar Acesso"
            utmContent="contato"
            className="bg-benedini-gold text-benedini-dark px-10 py-4 font-semibold text-lg hover:bg-benedini-gold-light transition min-h-[44px]"
          />
        </div>
      </div>
    </section>
  )
}
