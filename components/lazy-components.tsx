"use client"

import { lazy, Suspense } from 'react'
import { Loader2 } from 'lucide-react'

// Componente de loading para lazy components
const LazyLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex items-center space-x-2">
      <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
      <span className="text-gray-600">Cargando...</span>
    </div>
  </div>
)

// Lazy loading de componentes pesados
export const LazyMedicalHistory = lazy(() => import('@/app/medical-history/page'))
export const LazyReports = lazy(() => import('@/app/reports/page'))
export const LazyAdvice = lazy(() => import('@/app/advice/page'))
export const LazyNotes = lazy(() => import('@/app/notes/page'))
export const LazyReminders = lazy(() => import('@/app/reminders/page'))
export const LazySettings = lazy(() => import('@/app/settings/page'))

// Wrapper para componentes lazy con fallback
export const LazyComponentWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LazyLoadingFallback />}>
    {children}
  </Suspense>
)

// Componentes específicos con lazy loading
export const MedicalHistoryLazy = () => (
  <LazyComponentWrapper>
    <LazyMedicalHistory />
  </LazyComponentWrapper>
)

export const ReportsLazy = () => (
  <LazyComponentWrapper>
    <LazyReports />
  </LazyComponentWrapper>
)

export const AdviceLazy = () => (
  <LazyComponentWrapper>
    <LazyAdvice />
  </LazyComponentWrapper>
)

export const NotesLazy = () => (
  <LazyComponentWrapper>
    <LazyNotes />
  </LazyComponentWrapper>
)

export const RemindersLazy = () => (
  <LazyComponentWrapper>
    <LazyReminders />
  </LazyComponentWrapper>
)

export const SettingsLazy = () => (
  <LazyComponentWrapper>
    <LazySettings />
  </LazyComponentWrapper>
) 