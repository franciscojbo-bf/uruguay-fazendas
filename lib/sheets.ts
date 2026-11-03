const SHEET_ID = '1UrZyoHlyb1q5l46YIBD72mummIl9xDqTdlRCwn0dorw'

// Busca uma aba do Google Sheets publicado como JSON
async function fetchSheet(sheetName: string): Promise<string[][]> {
  // Usa a API pública do Google Sheets v4 (requer planilha publicada)
  // Alternativa: export CSV via gviz
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`
  const res = await fetch(url, { next: { revalidate: 300 } })
  const text = await res.text()
  return parseCSV(text)
}

function parseCSV(text: string): string[][] {
  const rows: string[][] = []
  let current = ''
  let inQuotes = false
  let row: string[] = []

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      row.push(current.trim())
      current = ''
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (current || row.length > 0) {
        row.push(current.trim())
        rows.push(row)
        row = []
        current = ''
      }
      if (char === '\r' && text[i + 1] === '\n') i++
    } else {
      current += char
    }
  }
  if (current || row.length > 0) {
    row.push(current.trim())
    rows.push(row)
  }
  return rows
}

// Tipos
export interface Propriedade {
  status: string
  slug: string
  nome: string
  departamento: string
  area_ha: number
  preco_por_ha_usd: number
  valor_total_usd: number
  descricao: string
  infraestrutura: string
  recursos_hidricos: string
  mapa_url: string
  fotos: string[]
  solos: Solo[]
  rendas: Renda[]
  coneat_medio: number
  yield_percentual: number
}

export interface Solo {
  grupo_coneat: string
  ic: number
  area_ha: number
  aptidao: string
  percentual: number
}

export interface Renda {
  tipo_renda: string
  area_ha: number
  unidade_pagamento: string
  valor_por_unidade: number
  observacao: string
}

export interface Cotacao {
  produto: string
  valor_usd: number
  unidade: string
  fonte: string
}

function rowsToObjects(rows: string[][]): Record<string, string>[] {
  if (rows.length < 2) return []
  const keys = rows[0].map(header => {
    const parts = header.trim().split(/\s+/)
    return parts[parts.length - 1]
  })
  return rows.slice(1).map(row => {
    const obj: Record<string, string> = {}
    keys.forEach((key, i) => {
      if (key) obj[key] = row[i] || ''
    })
    return obj
  })
}

export async function getPropriedades(): Promise<Propriedade[]> {
  const [propRows, soloRows, rendaRows] = await Promise.all([
    fetchSheet('PROPRIEDADES'),
    fetchSheet('SOLOS'),
    fetchSheet('RENDA'),
  ])

  const props = rowsToObjects(propRows)
  const solos = rowsToObjects(soloRows)
  const rendas = rowsToObjects(rendaRows)

  return props
    .filter(p => p.status && p.slug)
    .map(p => {
      const propSolos: Solo[] = solos
        .filter(s => s.slug === p.slug)
        .map(s => ({
          grupo_coneat: s.grupo_coneat,
          ic: parseFloat(s.ic) || 0,
          area_ha: parseFloat(s.area_ha) || 0,
          aptidao: s.aptidao,
          percentual: 0,
        }))

      const areaTotal = parseFloat(p.area_ha) || 1
      propSolos.forEach(s => {
        s.percentual = s.area_ha / areaTotal
      })

      const coneatMedio = propSolos.length > 0
        ? propSolos.reduce((sum, s) => sum + s.ic * s.area_ha, 0) / propSolos.reduce((sum, s) => sum + s.area_ha, 0)
        : 0

      const propRendas: Renda[] = rendas
        .filter(r => r.slug === p.slug)
        .map(r => ({
          tipo_renda: r.tipo_renda,
          area_ha: parseFloat(r.area_ha) || 0,
          unidade_pagamento: r.unidade_pagamento,
          valor_por_unidade: parseFloat(r.valor_por_unidade) || 0,
          observacao: r.observacao,
        }))

      const fotos = [p.foto1_url, p.foto2_url, p.foto3_url, p.foto4_url, p.foto5_url, p.foto6_url, p.foto7_url, p.foto8_url]
        .filter(Boolean)
        .map(url => url.includes('drive.google.com/file/d/') 
          ? `https://drive.google.com/thumbnail?id=${url.split('/d/')[1]?.split('/')[0]}&sz=w1200`
          : url)

      return {
        status: p.status,
        slug: p.slug,
        nome: p.nome,
        departamento: p.departamento,
        area_ha: parseFloat(p.area_ha) || 0,
        preco_por_ha_usd: parseFloat(p.preco_por_ha_usd) || 0,
        valor_total_usd: parseFloat(p.valor_total_usd) || 0,
        descricao: p.descricao,
        infraestrutura: p.infraestrutura,
        recursos_hidricos: p.recursos_hidricos,
        mapa_url: p.mapa_url?.includes('drive.google.com/file/d/')
          ? `https://drive.google.com/thumbnail?id=${p.mapa_url.split('/d/')[1]?.split('/')[0]}&sz=w1600`
          : p.mapa_url,
        fotos,
        solos: propSolos,
        rendas: propRendas,
        coneat_medio: Math.round(coneatMedio),
        yield_percentual: 0, // calculado depois com cotações
      }
    })
}

export async function getPropriedade(slug: string): Promise<Propriedade | null> {
  const props = await getPropriedades()
  return props.find(p => p.slug === slug) || null
}

export async function getCotacoes(): Promise<Cotacao[]> {
  const rows = await fetchSheet('COTAÇÕES')
  return rowsToObjects(rows).map(c => ({
    produto: c.produto,
    valor_usd: parseFloat(c.valor_usd) || 0,
    unidade: c.unidade,
    fonte: c.fonte,
  }))
}
