// Aviso por e-mail (Resend) quando um novo lead do /hotline é gravado na planilha.
// Só roda no servidor (chamado pela server action). Falhas aqui nunca bloqueiam o lead:
// a planilha é a fonte da verdade, o e-mail é só um aviso.

import { BASE_URL, HOTLINE_EMAIL_FROM } from '@/lib/config'
import { soDigitos } from '@/lib/hotline'

export type LeadHotline = Record<string, string>

const ROTULOS: Record<string, string> = {
  perfil: 'Perfil',
  quando_investir: 'Quando pretende investir',
  o_que_pesa: 'O que mais pesa',
  faixa_valor: 'Faixa de valor',
  disponibilidade: 'Disponibilidade do dinheiro',
  quem_decide: 'Quem decide',
  nome: 'Nome',
  whatsapp: 'WhatsApp',
  email: 'E-mail',
  propriedade: 'Propriedade',
  botao_origem: 'Botão de origem',
  utm_source: 'utm_source',
  utm_medium: 'utm_medium',
  utm_campaign: 'utm_campaign',
  utm_content: 'utm_content',
  utm_term: 'utm_term',
}

function escaparHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function linkWhatsapp(whatsapp: string): string {
  const d = soDigitos(whatsapp)
  // 10 ou 11 dígitos = DDD + número (Brasil); mais que isso já vem com código do país
  return `https://wa.me/${d.length <= 11 ? `55${d}` : d}`
}

function montarEmail(lead: LeadHotline) {
  const linhas = Object.keys(ROTULOS).filter((k) => lead[k])

  const linhasHtml = linhas
    .map((k) => {
      let valor = escaparHtml(lead[k])
      if (k === 'whatsapp') valor = `<a href="${linkWhatsapp(lead[k])}">${valor}</a>`
      if (k === 'email') valor = `<a href="mailto:${escaparHtml(lead[k])}">${valor}</a>`
      return `<tr><td style="padding:6px 12px 6px 0;color:#666;vertical-align:top;white-space:nowrap">${ROTULOS[k]}</td><td style="padding:6px 0;color:#111">${valor}</td></tr>`
    })
    .join('')

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;max-width:560px">
<p style="margin:0 0 16px">Nova resposta no formulário <a href="${BASE_URL}/hotline">/hotline</a>. Já está gravada na planilha de leads.</p>
<table style="border-collapse:collapse">${linhasHtml}</table>
</div>`

  const text = [
    'Nova resposta no formulário /hotline (já gravada na planilha de leads).',
    '',
    ...linhas.map((k) => `${ROTULOS[k]}: ${lead[k]}`),
  ].join('\n')

  // Assunto em uma linha só, sem quebras vindas do formulário
  const subject = `Novo lead Hotline: ${lead.nome} · ${lead.perfil}`.replace(/\s+/g, ' ').slice(0, 150)

  return { subject, html, text }
}

export async function notificarLead(lead: LeadHotline): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const para = (process.env.HOTLINE_EMAIL_TO ?? '')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean)

  const { subject, html, text } = montarEmail(lead)

  if (!apiKey || para.length === 0) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[hotline] RESEND_API_KEY ou HOTLINE_EMAIL_TO ausentes; e-mail NÃO enviado:', subject)
    } else {
      console.error('[hotline] RESEND_API_KEY ou HOTLINE_EMAIL_TO ausentes; aviso por e-mail desativado')
    }
    return
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: HOTLINE_EMAIL_FROM,
        to: para,
        subject,
        html,
        text,
        // "Responder" no e-mail vai direto para o lead, quando ele informou e-mail
        ...(lead.email ? { reply_to: lead.email } : {}),
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) {
      const corpo = await res.text().catch(() => '')
      console.error('[hotline] Resend recusou o e-mail', res.status, corpo.slice(0, 300))
    }
  } catch (err) {
    console.error('[hotline] Falha ao enviar e-mail pelo Resend', err)
  }
}
