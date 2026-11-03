'use client'

import { TYPEFORM_URL } from '@/lib/config'
import { sendGAEvent } from '@next/third-parties/google'

interface Props {
  label: string
  utmContent: string
  propriedade?: string
  className?: string
}

function getUtms(utmContent: string): Record<string, string> {
  const stored: Record<string, string> = {}
  try {
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
    keys.forEach(k => {
      const v = sessionStorage.getItem(k)
      if (v) stored[k] = v
    })
  } catch {}

  if (stored.utm_source) {
    return { ...stored, utm_campaign: 'pl', utm_content: utmContent }
  }

  return {
    utm_source: 'site',
    utm_medium: 'botao',
    utm_campaign: 'pl',
    utm_content: utmContent,
  }
}

export default function TypeformButton({ label, utmContent, propriedade, className }: Props) {
  function handleClick() {
    try {
      sendGAEvent('event', 'clique_acesso_uruguai', { botao: utmContent })
    } catch {}

    const utms = getUtms(utmContent)
    const params = new URLSearchParams(utms)
    if (propriedade) params.set('propriedade', propriedade)

    window.location.href = `${TYPEFORM_URL}#${params.toString()}`
  }

  return (
    <button onClick={handleClick} className={className}>
      {label}
    </button>
  )
}
