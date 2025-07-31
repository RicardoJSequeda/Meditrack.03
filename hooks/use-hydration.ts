"use client"

import { useState, useEffect } from 'react'

export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated
}

export function useClientOnly<T>(value: T, fallback: T): T {
  const mounted = useHydration()
  return mounted ? value : fallback
} 