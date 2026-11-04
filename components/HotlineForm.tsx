'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { sendGAEvent } from '@next/third-parties/google'
import { enviarHotline, type HotlineInput } from '@/app/hotline/actions'
import { CALENDLY_URL, EBOOK_URL } from '@/lib/config'
import {
  PERFIS,
  PERFIL_PRODUTOR,
  PERFIL_FAMILIA,
  QUANDO_INVESTIR,
  O_QUE_PESA,
  O_QUE_PESA_MAX,
  FAIXAS_VALOR,
  DISPONIBILIDADE,
  QUEM_DECIDE,
  UTM_KEYS,
  formatarWhatsapp,
  whatsappValido,
} from '@/lib/hotline'

type Step = 'intro' | 'perfil' | 'q2' | 'faixa' | 'disponibilidade' | 'quem_decide' | 'contato' | 'obrigado'

const ORDEM: Step[] = ['intro', 'perfil', 'q2', 'faixa', 'disponibilidade', 'quem_decide', 'contato', 'obrigado']
const TOTAL_PERGUNTAS = 5

interface Respostas {
  perfil?: (typeof PERFIS)[number]
  quando_investir?: (typeof QUANDO_INVESTIR)[number]
  o_que_pesa: (typeof O_QUE_PESA)[number][]
  faixa_valor?: (typeof FAIXAS_VALOR)[number]
  disponibilidade?: (typeof DISPONIBILIDADE)[number]
  quem_decide: (typeof QUEM_DECIDE)[number][]
}

interface Contato {
  nome: string
  whatsapp: string
  email: string
}

type Origem = Pick<HotlineInput, 'propriedade' | 'botao_origem' | 'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_content' | 'utm_term'>

function lerOrigem(): Origem {
  const origem: Record<string, string> = {}
  try {
    const params = new URLSearchParams(window.location.search)
    origem.botao_origem = params.get('origem') || 'direto'
    origem.propriedade = params.get('propriedade') || ''
    for (const k of UTM_KEYS) {
      origem[k] = params.get(k) || sessionStorage.getItem(k) || ''
    }
  } catch {}
  return origem as Origem
}

export default function HotlineForm() {
  const [step, setStep] = useState<Step>('intro')
  const [respostas, setRespostas] = useState<Respostas>({ o_que_pesa: [], quem_decide: [] })
  const [contato, setContato] = useState<Contato>({ nome: '', whatsapp: '', email: '' })
  const [tentouEnviar, setTentouEnviar] = useState(false)
  const [erro, setErro] = useState('')
  const [enviando, startTransition] = useTransition()
  const origem = useRef<Origem>({})
  const titulo = useRef<HTMLHeadingElement>(null)
  const avancoPendente = useRef<number | null>(null)

  useEffect(() => {
    origem.current = lerOrigem()
    // O Next rola até o <main>, que fica atrás do cabeçalho fixo: volta ao topo
    window.scrollTo({ top: 0 })
    return () => {
      if (avancoPendente.current) window.clearTimeout(avancoPendente.current)
    }
  }, [])

  // Acessibilidade: leva o foco para o título de cada nova tela
  useEffect(() => {
    // preventScroll: sem isso o navegador rola o título para baixo do cabeçalho fixo
    if (step !== 'intro') titulo.current?.focus({ preventScroll: true })
  }, [step])

  function irPara(s: Step) {
    setErro('')
    setStep(s)
    window.scrollTo({ top: 0 })
  }

  function avancar() {
    irPara(ORDEM[ORDEM.indexOf(step) + 1])
  }

  function voltar() {
    if (avancoPendente.current) window.clearTimeout(avancoPendente.current)
    irPara(ORDEM[ORDEM.indexOf(step) - 1])
  }

  // Escolha única: marca e avança sozinho depois de um instante (feedback visual)
  function escolher<K extends 'perfil' | 'quando_investir' | 'faixa_valor' | 'disponibilidade'>(campo: K, valor: Respostas[K]) {
    setRespostas((r) => ({ ...r, [campo]: valor }))
    if (avancoPendente.current) window.clearTimeout(avancoPendente.current)
    avancoPendente.current = window.setTimeout(avancar, 220)
  }

  function alternar(campo: 'o_que_pesa' | 'quem_decide', valor: string, max: number) {
    setRespostas((r) => {
      const atual = r[campo] as string[]
      const proximo = atual.includes(valor)
        ? atual.filter((v) => v !== valor)
        : atual.length < max
          ? [...atual, valor]
          : atual
      return { ...r, [campo]: proximo }
    })
  }

  const nomeOk = contato.nome.trim().length >= 2
  const whatsappOk = whatsappValido(contato.whatsapp)
  const emailOk = !contato.email.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contato.email.trim())

  function enviar(e: React.FormEvent) {
    e.preventDefault()
    setTentouEnviar(true)
    if (!nomeOk || !whatsappOk || !emailOk || !respostas.perfil || !respostas.faixa_valor || !respostas.disponibilidade) return

    const dados: HotlineInput = {
      perfil: respostas.perfil,
      quando_investir: respostas.quando_investir,
      o_que_pesa: respostas.o_que_pesa,
      faixa_valor: respostas.faixa_valor,
      disponibilidade: respostas.disponibilidade,
      quem_decide: respostas.quem_decide,
      nome: contato.nome.trim(),
      whatsapp: contato.whatsapp,
      email: contato.email.trim(),
      ...origem.current,
    }

    startTransition(async () => {
      setErro('')
      const res = await enviarHotline(dados).catch(() => ({ ok: false as const, error: 'Falha de conexão. Tente novamente.' }))
      if (!res.ok) {
        setErro(res.error)
        return
      }
      try {
        // Sem dados pessoais no GA: só o perfil e a faixa
        sendGAEvent('event', 'lead_hotline', { perfil: respostas.perfil, faixa_valor: respostas.faixa_valor })
      } catch {}
      irPara('obrigado')
    })
  }

  const numeroPergunta = ORDEM.indexOf(step) // perfil = 1 ... quem_decide = 5
  const emPergunta = numeroPergunta >= 1 && numeroPergunta <= TOTAL_PERGUNTAS
  const produtor = respostas.perfil === PERFIL_PRODUTOR
  const primeiroNome = contato.nome.trim().split(/\s+/)[0]

  const calendlyHref = CALENDLY_URL
    ? `${CALENDLY_URL}${CALENDLY_URL.includes('?') ? '&' : '?'}${new URLSearchParams({
        name: contato.nome.trim(),
        ...(contato.email.trim() ? { email: contato.email.trim() } : {}),
      }).toString()}`
    : ''

  return (
    <div className={`min-h-[calc(100vh-4rem)] ${step === 'contato' ? 'bg-benedini-cream' : step === 'obrigado' ? 'bg-benedini-dark' : 'bg-benedini-green'} transition-colors`}>
      <div className="max-w-xl mx-auto px-6 py-10 md:py-16">
        {/* Topo: voltar + progresso */}
        {step !== 'intro' && step !== 'obrigado' && (
          <div className="mb-10">
            <button
              type="button"
              onClick={voltar}
              className={`text-sm min-h-[44px] ${step === 'contato' ? 'text-benedini-muted hover:text-benedini-green' : 'text-white/60 hover:text-white'} transition`}
            >
              ← Voltar
            </button>
            <div
              className={`mt-2 h-1 rounded-full ${step === 'contato' ? 'bg-benedini-card' : 'bg-white/15'}`}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={TOTAL_PERGUNTAS + 1}
              aria-valuenow={Math.min(numeroPergunta, TOTAL_PERGUNTAS + 1)}
              aria-label="Progresso do formulário"
            >
              <div
                className="h-full rounded-full bg-benedini-gold transition-all duration-300"
                style={{ width: `${(Math.min(numeroPergunta, TOTAL_PERGUNTAS + 1) / (TOTAL_PERGUNTAS + 1)) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* ---------- Abertura ---------- */}
        {step === 'intro' && (
          <div className="text-white py-8">
            <p className="text-benedini-gold text-xs font-semibold tracking-[0.2em] uppercase">Benedini Fazendas · Uruguai</p>
            <h1 className="font-display text-4xl md:text-5xl mt-4">Agenda Reservada Uruguai</h1>
            <p className="mt-6 text-white/75 text-lg leading-relaxed">
              Leva menos de 1 minuto. Suas respostas são confidenciais e usadas só para preparar sua conversa com nossos especialistas.
            </p>
            <button
              type="button"
              onClick={avancar}
              className="mt-10 w-full sm:w-auto bg-benedini-gold text-benedini-dark px-12 py-4 font-semibold text-lg hover:bg-benedini-gold-light transition min-h-[44px]"
            >
              Começar
            </button>
          </div>
        )}

        {/* ---------- Pergunta 1 ---------- */}
        {step === 'perfil' && (
          <Pergunta numero={1} titulo="Para começar, qual destas opções descreve melhor você?" tituloRef={titulo}>
            <Opcoes>
              {PERFIS.map((op) => (
                <Opcao key={op} selecionada={respostas.perfil === op} onClick={() => escolher('perfil', op)}>
                  {op}
                </Opcao>
              ))}
            </Opcoes>
          </Pergunta>
        )}

        {/* ---------- Pergunta 2 (depende do perfil) ---------- */}
        {step === 'q2' && produtor && (
          <Pergunta numero={2} titulo="Quando você pretende investir?" tituloRef={titulo}>
            <Opcoes>
              {QUANDO_INVESTIR.map((op) => (
                <Opcao key={op} selecionada={respostas.quando_investir === op} onClick={() => escolher('quando_investir', op)}>
                  {op}
                </Opcao>
              ))}
            </Opcoes>
          </Pergunta>
        )}

        {step === 'q2' && !produtor && (
          <Pergunta
            numero={2}
            titulo={`O que mais pesa para ${respostas.perfil === PERFIL_FAMILIA ? 'a família' : 'você'} ao considerar terra fora do Brasil?`}
            dica="Marque até duas e toque em Continuar."
            tituloRef={titulo}
          >
            <Opcoes multipla>
              {O_QUE_PESA.map((op) => {
                const marcada = respostas.o_que_pesa.includes(op)
                return (
                  <Opcao
                    key={op}
                    multipla
                    selecionada={marcada}
                    desabilitada={!marcada && respostas.o_que_pesa.length >= O_QUE_PESA_MAX}
                    onClick={() => alternar('o_que_pesa', op, O_QUE_PESA_MAX)}
                  >
                    {op}
                  </Opcao>
                )
              })}
            </Opcoes>
            <Continuar disabled={respostas.o_que_pesa.length === 0} onClick={avancar} />
          </Pergunta>
        )}

        {/* ---------- Pergunta 3 ---------- */}
        {step === 'faixa' && (
          <Pergunta numero={3} titulo="Quanto você pensa em colocar na compra da área?" dica="Faixa aproximada e confidencial." tituloRef={titulo}>
            <Opcoes>
              {FAIXAS_VALOR.map((op) => (
                <Opcao key={op} selecionada={respostas.faixa_valor === op} onClick={() => escolher('faixa_valor', op)}>
                  {op}
                </Opcao>
              ))}
            </Opcoes>
          </Pergunta>
        )}

        {/* ---------- Pergunta 4 ---------- */}
        {step === 'disponibilidade' && (
          <Pergunta numero={4} titulo="Quando esse dinheiro estará disponível?" tituloRef={titulo}>
            <Opcoes>
              {DISPONIBILIDADE.map((op) => (
                <Opcao key={op} selecionada={respostas.disponibilidade === op} onClick={() => escolher('disponibilidade', op)}>
                  {op}
                </Opcao>
              ))}
            </Opcoes>
          </Pergunta>
        )}

        {/* ---------- Pergunta 5 ---------- */}
        {step === 'quem_decide' && (
          <Pergunta
            numero={5}
            titulo="Quem decide a compra com você?"
            dica="Pode marcar mais de uma. Depois, toque em Continuar."
            tituloRef={titulo}
          >
            <Opcoes multipla>
              {QUEM_DECIDE.map((op) => (
                <Opcao
                  key={op}
                  multipla
                  selecionada={respostas.quem_decide.includes(op)}
                  onClick={() => alternar('quem_decide', op, QUEM_DECIDE.length)}
                >
                  {op}
                </Opcao>
              ))}
            </Opcoes>
            <Continuar disabled={respostas.quem_decide.length === 0} onClick={avancar} />
          </Pergunta>
        )}

        {/* ---------- Dados de contato ---------- */}
        {step === 'contato' && (
          <form onSubmit={enviar} noValidate>
            <p className="text-benedini-gold text-xs font-semibold tracking-[0.2em] uppercase">Último passo</p>
            <h2 ref={titulo} tabIndex={-1} className="font-display text-3xl md:text-4xl text-benedini-green mt-3 outline-none">
              Para finalizar, como falamos com você?
            </h2>

            <div className="mt-8 space-y-6">
              <Campo
                id="nome"
                label="Nome"
                obrigatorio
                autoComplete="name"
                value={contato.nome}
                onChange={(v) => setContato((c) => ({ ...c, nome: v }))}
                erro={tentouEnviar && !nomeOk ? 'Informe seu nome.' : ''}
              />
              <Campo
                id="whatsapp"
                label="WhatsApp"
                obrigatorio
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="(16) 99999-0000"
                value={contato.whatsapp}
                onChange={(v) => setContato((c) => ({ ...c, whatsapp: formatarWhatsapp(v) }))}
                erro={tentouEnviar && !whatsappOk ? 'Informe um WhatsApp com DDD.' : ''}
              />
              <Campo
                id="email"
                label="E-mail (opcional)"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="seu@email.com"
                value={contato.email}
                onChange={(v) => setContato((c) => ({ ...c, email: v }))}
                erro={tentouEnviar && !emailOk ? 'Confira o e-mail.' : ''}
              />
            </div>

            {erro && (
              <p role="alert" className="mt-6 text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="mt-10 w-full bg-benedini-gold text-benedini-dark py-4 font-semibold text-lg hover:bg-benedini-gold-light transition min-h-[44px] disabled:opacity-60 disabled:cursor-wait"
            >
              {enviando ? 'Enviando...' : 'Enviar respostas'}
            </button>
          </form>
        )}

        {/* ---------- Obrigado ---------- */}
        {step === 'obrigado' && (
          <div className="text-white py-8" aria-live="polite">
            <p className="text-benedini-gold text-xs font-semibold tracking-[0.2em] uppercase">Respostas enviadas</p>
            <h2 ref={titulo} tabIndex={-1} className="font-display text-4xl md:text-5xl mt-4 outline-none">
              Obrigado, {primeiroNome}. Recebemos suas respostas.
            </h2>
            <p className="mt-6 text-white/75 text-lg">Nosso especialista vai lhe atender.</p>

            <div className="mt-10 flex flex-col gap-3">
              {EBOOK_URL && (
                <a
                  href={EBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    try { sendGAEvent('event', 'download_ebook', { origem: 'hotline' }) } catch {}
                  }}
                  className="bg-benedini-gold text-benedini-dark text-center py-4 font-semibold hover:bg-benedini-gold-light transition min-h-[44px]"
                >
                  Baixar o E-Book Uruguai
                </a>
              )}
              {calendlyHref && (
                <a
                  href={calendlyHref}
                  onClick={() => {
                    try { sendGAEvent('event', 'abrir_calendly', { origem: 'hotline' }) } catch {}
                  }}
                  className="border border-white/40 text-white text-center py-4 font-semibold hover:border-benedini-gold hover:text-benedini-gold transition min-h-[44px]"
                >
                  Agendar conversa
                </a>
              )}
              <a href="/fazendas" className="text-white/60 hover:text-white text-sm text-center py-3 transition">
                Ver fazendas disponíveis
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------------- Componentes de apoio ---------------- */

function Pergunta({
  numero,
  titulo,
  dica,
  tituloRef,
  children,
}: {
  numero: number
  titulo: string
  dica?: string
  tituloRef: React.RefObject<HTMLHeadingElement | null>
  children: React.ReactNode
}) {
  return (
    <fieldset className="text-white">
      <legend className="sr-only">{titulo}</legend>
      <p className="text-benedini-gold text-xs font-semibold tracking-[0.2em] uppercase">
        Pergunta {numero} de {TOTAL_PERGUNTAS}
      </p>
      <h2 ref={tituloRef} tabIndex={-1} className="font-display text-3xl md:text-4xl mt-3 leading-tight outline-none">
        {titulo}
      </h2>
      {dica && <p className="mt-3 text-white/60">{dica}</p>}
      {children}
    </fieldset>
  )
}

function Opcoes({ multipla, children }: { multipla?: boolean; children: React.ReactNode }) {
  return (
    <div role="group" aria-label={multipla ? 'Escolha uma ou mais opções' : 'Escolha uma opção'} className="mt-8 space-y-3">
      {children}
    </div>
  )
}

function Opcao({
  selecionada,
  desabilitada,
  multipla,
  onClick,
  children,
}: {
  selecionada: boolean
  desabilitada?: boolean
  multipla?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={desabilitada}
      aria-pressed={selecionada}
      className={`w-full text-left flex items-center gap-4 px-5 py-4 border transition min-h-[56px] ${
        selecionada
          ? 'border-benedini-gold bg-benedini-gold/15'
          : 'border-white/25 hover:border-white/60 hover:bg-white/5'
      } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      <span
        aria-hidden="true"
        className={`shrink-0 w-4 h-4 border flex items-center justify-center ${multipla ? '' : 'rounded-full'} ${
          selecionada ? 'border-benedini-gold bg-benedini-gold' : 'border-white/60'
        }`}
      >
        {selecionada && multipla && (
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-benedini-dark">
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
          </svg>
        )}
      </span>
      <span>{children}</span>
    </button>
  )
}

function Continuar({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="mt-8 w-full sm:w-auto bg-benedini-gold text-benedini-dark px-12 py-4 font-semibold hover:bg-benedini-gold-light transition min-h-[44px] disabled:opacity-40 disabled:cursor-not-allowed"
    >
      Continuar
    </button>
  )
}

function Campo({
  id,
  label,
  obrigatorio,
  erro,
  value,
  onChange,
  ...rest
}: {
  id: string
  label: string
  obrigatorio?: boolean
  erro?: string
  value: string
  onChange: (v: string) => void
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'id'>) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm text-benedini-muted">
        {label}
        {obrigatorio && <span className="text-benedini-gold"> *</span>}
      </label>
      <input
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={obrigatorio}
        aria-invalid={!!erro}
        aria-describedby={erro ? `${id}-erro` : undefined}
        className={`mt-1 w-full bg-transparent border-b-2 py-2 text-lg text-benedini-text outline-none transition ${
          erro ? 'border-red-600' : 'border-benedini-green/30 focus:border-benedini-gold'
        }`}
        {...rest}
      />
      {erro && (
        <p id={`${id}-erro`} className="mt-1 text-sm text-red-700">
          {erro}
        </p>
      )}
    </div>
  )
}
