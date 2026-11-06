'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { sendGAEvent } from '@next/third-parties/google'
import { hotlineHref } from '@/lib/hotline'

interface Props {
  label: string
  /** Identifica o botão clicado (vai para a coluna botao_origem da planilha) */
  utmContent: string
  propriedade?: string
  className?: string
  /** Esconde o botão quando o usuário já está no formulário (menu e faixa do topo) */
  ocultarNoHotline?: boolean
}

export default function HotlineButton({ label, utmContent, propriedade, className, ocultarNoHotline }: Props) {
  const pathname = usePathname()
  if (ocultarNoHotline && pathname === '/hotline') return null

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
