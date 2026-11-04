'use client'

import Link from 'next/link'
import { sendGAEvent } from '@next/third-parties/google'
import { hotlineHref } from '@/lib/hotline'

interface Props {
  label: string
  /** Identifica o botão clicado (vai para a coluna botao_origem da planilha) */
  utmContent: string
  propriedade?: string
  className?: string
}

export default function HotlineButton({ label, utmContent, propriedade, className }: Props) {
  return (
    <Link
      href={hotlineHref(utmContent, propriedade)}
      onClick={() => {
        try {
          sendGAEvent('event', 'clique_acesso_uruguai', { botao: utmContent })
        } catch {}
      }}
      className={`inline-flex items-center justify-center text-center ${className ?? ''}`}
    >
      {label}
    </Link>
  )
}
