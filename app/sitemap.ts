import type { MetadataRoute } from 'next'
import { getPropriedades } from '@/lib/sheets'

const BASE = 'https://uruguai.benedinifazendas.com.br'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const propriedades = await getPropriedades()

  const fazendas = propriedades
    .filter(p => p.status === 'Disponível')
    .map(p => ({
      url: `${BASE}/fazendas/${p.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

  return [
    {
      url: BASE,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE}/fazendas`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...fazendas,
  ]
}
