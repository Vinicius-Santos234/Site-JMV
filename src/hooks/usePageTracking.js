import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function usePageTracking() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (typeof window.gtag !== 'function') return
    window.gtag('event', 'page_view', { page_path: pathname })
  }, [pathname])
}
