'use server'

import { after } from 'next/server'
import { z } from 'zod'
import { notificarLead } from '@/lib/notificar-lead'
import {
  PERFIS,
  PERFIL_PRODUTOR,
  QUANDO_INVESTIR,
  O_QUE_PESA,
  O_QUE_PESA_MAX,
  FAIXAS_VALOR,
  DISPONIBILIDADE,
  QUEM_DECIDE,
  formatarWhatsapp,
  whatsappValido,
} from '@/lib/hotline'

const textoCurto = z.string().trim().max(120).optional().default('')

const schema = z
  .object({
    perfil: z.enum(PERFIS),
    quando_investir: z.enum(QUANDO_INVESTIR).optional(),
    o_que_pesa: z.array(z.enum(O_QUE_PESA)).max(O_QUE_PESA_MAX).optional().default([]),
    faixa_valor: z.enum(FAIXAS_VALOR),
    disponibilidade: z.enum(DISPONIBILIDADE),
    quem_decide: z.array(z.enum(QUEM_DECIDE)).min(1).max(QUEM_DECIDE.length),
    nome: z.string().trim().min(2, 'Informe seu nome').max(80),
    whatsapp: z.string().trim().refine(whatsappValido, 'WhatsApp inválido'),
    email: z.union([z.literal(''), z.email('E-mail inválido').max(120)]).optional().default(''),
    propriedade: textoCurto,
    botao_origem: textoCurto,
    utm_source: textoCurto,
    utm_medium: textoCurto,
    utm_campaign: textoCurto,
    utm_content: textoCurto,
    utm_term: textoCurto,
  })
  .superRefine((d, ctx) => {
    // A pergunta 2 depende do perfil
    if (d.perfil === PERFIL_PRODUTOR) {
      if (!d.quando_investir) ctx.addIssue({ code: 'custom', path: ['quando_investir'], message: 'Obrigatório' })
    } else if (d.o_que_pesa.length === 0) {
      ctx.addIssue({ code: 'custom', path: ['o_que_pesa'], message: 'Obrigatório' })
    }
  })

export type HotlineInput = z.input<typeof schema>
export type HotlineResult = { ok: true } | { ok: false; error: string }

const ERRO_GENERICO = 'Não conseguimos enviar suas respostas agora. Tente novamente em instantes.'

export async function enviarHotline(input: HotlineInput): Promise<HotlineResult> {
  const parsed = schema.safeParse(input)
  if (!parsed.success) {
    // Só os campos de contato têm mensagens próprias; o resto não deveria falhar vindo do formulário
    const issue = parsed.error.issues[0]
    const campoContato = ['nome', 'whatsapp', 'email'].includes(String(issue?.path[0]))
    return { ok: false, error: campoContato ? issue.message : 'Confira suas respostas e tente novamente.' }
  }
  const d = parsed.data
  const produtor = d.perfil === PERFIL_PRODUTOR

  // Ordem das chaves = ordem das colunas na primeira gravação da planilha
  const linha = {
    perfil: d.perfil,
    quando_investir: produtor ? d.quando_investir ?? '' : '',
    o_que_pesa: produtor ? '' : d.o_que_pesa.join(', '),
    faixa_valor: d.faixa_valor,
    disponibilidade: d.disponibilidade,
    quem_decide: d.quem_decide.join(', '),
    nome: d.nome,
    whatsapp: formatarWhatsapp(d.whatsapp),
    email: d.email,
    propriedade: d.propriedade,
    botao_origem: d.botao_origem,
    utm_source: d.utm_source,
    utm_medium: d.utm_medium,
    utm_campaign: d.utm_campaign,
    utm_content: d.utm_content,
    utm_term: d.utm_term,
  }

  const url = process.env.HOTLINE_SCRIPT_URL
  const token = process.env.HOTLINE_TOKEN

  if (!url || !token) {
    if (process.env.NODE_ENV !== 'production') {
      // Modo de teste local: sem planilha configurada, só registra no terminal
      console.info('[hotline] HOTLINE_SCRIPT_URL não configurada; lead NÃO gravado:', linha)
      after(() => notificarLead(linha))
      return { ok: true }
    }
    console.error('[hotline] HOTLINE_SCRIPT_URL ou HOTLINE_TOKEN ausentes')
    return { ok: false, error: ERRO_GENERICO }
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, data: linha }),
      redirect: 'follow',
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
    })
    const body = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null
    if (!res.ok || !body?.ok) {
      console.error('[hotline] Planilha recusou o envio', res.status, body?.error)
      return { ok: false, error: ERRO_GENERICO }
    }
    // Aviso por e-mail depois da resposta: o usuário não espera pelo Resend
    after(() => notificarLead(linha))
    return { ok: true }
  } catch (err) {
    console.error('[hotline] Falha ao gravar na planilha', err)
    return { ok: false, error: ERRO_GENERICO }
  }
}
