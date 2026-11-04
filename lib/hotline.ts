// Perguntas do formulário /hotline.
// Fonte única usada pelo formulário (cliente) e pela validação (servidor).
// Os textos das opções são gravados na planilha exatamente como aparecem aqui.

export const PERFIS = [
  'Sou produtor rural',
  'Sou empresário ou investidor',
  'Represento uma família ou family office',
] as const

export const PERFIL_PRODUTOR = PERFIS[0]
export const PERFIL_FAMILIA = PERFIS[2]

export const QUANDO_INVESTIR = ['Agora', 'Em 6 meses', 'Em 12 meses', 'Ainda não sei'] as const

export const O_QUE_PESA = [
  'Diversificar o patrimônio fora do Brasil',
  'Ter um ativo real, negociado em dólar',
  'Planejar a sucessão da família',
  'Preservar patrimônio no longo prazo',
] as const
export const O_QUE_PESA_MAX = 2

export const FAIXAS_VALOR = [
  'Até R$ 3 milhões',
  'De R$ 3 a 8 milhões',
  'De R$ 8 a 15 milhões',
  'Acima de R$ 15 milhões',
] as const

export const DISPONIBILIDADE = [
  'Imediatamente',
  'Em até 3 meses',
  'Em até 6 meses',
  'Em até 12 meses',
  'Em mais de 12 meses',
] as const

export const QUEM_DECIDE = [
  'Decido sozinho',
  'Com os filhos ou a família',
  'Com sócios',
  'Com contador ou advogado',
] as const

export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const

/** Monta o link do formulário a partir de um botão do site. */
export function hotlineHref(origem: string, propriedade?: string): string {
  const params = new URLSearchParams({ origem })
  if (propriedade) params.set('propriedade', propriedade)
  return `/hotline?${params.toString()}`
}

/** Mantém só os dígitos do WhatsApp. Aceita DDD + número (BR) ou número internacional. */
export function soDigitos(valor: string): string {
  return valor.replace(/\D/g, '')
}

export function whatsappValido(valor: string): boolean {
  const d = soDigitos(valor)
  return d.length >= 10 && d.length <= 13
}

/** Máscara simples para números brasileiros: (16) 99999-0000 */
export function formatarWhatsapp(valor: string): string {
  const d = soDigitos(valor).slice(0, 13)
  if (d.length > 11) return `+${d}`
  if (d.length <= 2) return d.length ? `(${d}` : ''
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}
