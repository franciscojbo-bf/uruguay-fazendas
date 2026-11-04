import type { Metadata } from 'next'
import HotlineForm from '@/components/HotlineForm'

export const metadata: Metadata = {
  title: 'Agenda Reservada Uruguai | Benedini Fazendas',
  description: 'Solicite seu acesso à Agenda Reservada Uruguai e converse com nossos especialistas.',
  alternates: { canonical: '/hotline' },
  // Página de formulário: não precisa aparecer no Google
  robots: { index: false, follow: true },
}

export default function HotlinePage() {
  return (
    <main>
      <HotlineForm />
    </main>
  )
}
