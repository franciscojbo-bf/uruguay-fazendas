'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { AGENDA_FIM } from '@/lib/config'
import HotlineButton from './HotlineButton'

function formatDate(iso: string): string {
  const d = new Date(iso + 'T23:59:59')
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function AgendaBanner() {
  const [visible, setVisible] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setVisible(new Date() <= new Date(AGENDA_FIM + 'T23:59:59'))
  }, [])

  // No próprio formulário a faixa só distrai: o "AGENDAR" levaria para a mesma página
  if (!visible || pathname === '/hotline') return null

  return (
    <div className="bg-benedini-gold text-benedini-dark text-sm font-medium">
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-center gap-3 flex-wrap text-center">
        <span>Agenda Reservada Uruguai · Aberta até {formatDate(AGENDA_FIM)}</span>
        <HotlineButton
          label="AGENDAR"
          utmContent="faixa-agenda"
          className="bg-benedini-dark text-white px-4 py-1.5 text-xs font-semibold hover:bg-benedini-green transition min-h-[44px] flex items-center"
        />
      </div>
    </div>
  )
}
