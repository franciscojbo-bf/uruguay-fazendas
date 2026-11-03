'use client'

import { useEffect } from 'react'

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']

export default function UtmCapture() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const hasUtm = UTM_KEYS.some(k => params.get(k))
      if (hasUtm) {
        UTM_KEYS.forEach(k => {
          const v = params.get(k)
          if (v) sessionStorage.setItem(k, v)
        })
      }
    } catch {}
  }, [])

  return null
}
