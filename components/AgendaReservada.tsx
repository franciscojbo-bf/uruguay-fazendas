'use client'

import { useState, useEffect } from 'react'
import { AGENDA_FIM } from '@/lib/config'
import HotlineButton from './HotlineButton'

function formatDate(iso: string): string {
  const d = new Date(iso + 'T23:59:59')
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function AgendaReservada() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(new Date() <= new Date(AGENDA_FIM + 'T23:59:59'))
  }, [])

  if (!visible) return null

  return (
    <section id="agenda-reservada" className="py-20 bg-benedini-green">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="text-benedini-gold text-xs font-semibold tracking-[0.2em] uppercase">
          Aberta até {formatDate(AGENDA_FIM)}
        </p>
        <h2 className="font-display text-3xl md:text-5xl text-white mt-4">
          Agenda Reservada Uruguai
        </h2>
        <p className="mt-6 text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
          Até {formatDate(AGENDA_FIM)}, atendemos pessoalmente quem quer conhecer nossa lista seleta
          de propriedades no Uruguai. Para uma conversa reservada com nosso especialista, solicite seu acesso.
        </p>

        <div className="mt-10 grid sm:grid-cols-3 gap-6 text-left max-w-2xl mx-auto">
          {[
            'Atendimento pessoal e reservado',
            'Propriedades selecionadas, uma a uma',
            'E-Book Uruguai Benedini Fazendas ao final do formulário',
          ].map((ponto) => (
            <div key={ponto} className="flex items-start gap-3">
              <span className="text-benedini-gold mt-0.5 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              </span>
              <p className="text-white/90 text-sm">{ponto}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <HotlineButton
            label="Solicitar Acesso"
            utmContent="agenda"
            className="bg-benedini-gold text-benedini-dark px-10 py-4 font-semibold text-lg hover:bg-benedini-gold-light transition min-h-[44px]"
          />
        </div>
      </div>
    </section>
  )
}
