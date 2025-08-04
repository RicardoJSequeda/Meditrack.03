import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type Tables = Database['public']['Tables']
type TableNames = keyof Tables

interface UseSupabaseDBOptions {
  table: TableNames
  select?: string
  filters?: Record<string, any>
  orderBy?: { column: string; ascending?: boolean }
  limit?: number
}

interface QueryState<T> {
  data: T[] | null
  loading: boolean
  error: string | null
}

export function useSupabaseDB<T = any>(options: UseSupabaseDBOptions) {
  const [state, setState] = useState<QueryState<T>>({
    data: null,
    loading: false,
    error: null
  })

  const fetch = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      let query = supabase
        .from(options.table)
        .select(options.select || '*')

      // Aplicar filtros
      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value)
          }
        })
      }

      // Aplicar ordenamiento
      if (options.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending ?? true
        })
      }

      // Aplicar límite
      if (options.limit) {
        query = query.limit(options.limit)
      }

      const { data, error } = await query

      if (error) {
        setState(prev => ({ ...prev, error: error.message, loading: false }))
        return { error: error.message }
      }

      setState({ data: data as T[], loading: false, error: null })
      return { data: data as T[], error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return { error: errorMessage }
    }
  }, [options])

  const insert = useCallback(async (data: any) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const { data: result, error } = await supabase
        .from(options.table)
        .insert(data)
        .select()

      if (error) {
        setState(prev => ({ ...prev, error: error.message, loading: false }))
        return { error: error.message }
      }

      // Actualizar el estado local
      setState(prev => ({
        ...prev,
        data: prev.data ? [...prev.data, ...result] : result,
        loading: false
      }))

      return { data: result, error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return { error: errorMessage }
    }
  }, [options.table])

  const update = useCallback(async (id: string, updates: any) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const { data: result, error } = await supabase
        .from(options.table)
        .update(updates)
        .eq('id', id)
        .select()

      if (error) {
        setState(prev => ({ ...prev, error: error.message, loading: false }))
        return { error: error.message }
      }

      // Actualizar el estado local
      setState(prev => ({
        ...prev,
        data: prev.data ? prev.data.map(item => 
          (item as any).id === id ? { ...item, ...updates } : item
        ) : null,
        loading: false
      }))

      return { data: result, error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return { error: errorMessage }
    }
  }, [options.table])

  const remove = useCallback(async (id: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const { error } = await supabase
        .from(options.table)
        .delete()
        .eq('id', id)

      if (error) {
        setState(prev => ({ ...prev, error: error.message, loading: false }))
        return { error: error.message }
      }

      // Actualizar el estado local
      setState(prev => ({
        ...prev,
        data: prev.data ? prev.data.filter(item => (item as any).id !== id) : null,
        loading: false
      }))

      return { error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return { error: errorMessage }
    }
  }, [options.table])

  const subscribe = useCallback((callback: (payload: any) => void) => {
    const subscription = supabase
      .channel(`${options.table}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: options.table
        },
        callback
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [options.table])

  return {
    ...state,
    fetch,
    insert,
    update,
    remove,
    subscribe
  }
}

// Hooks específicos para cada tabla
export function useUsers() {
  return useSupabaseDB<Tables['users']['Row']>({ table: 'users' })
}

export function useDiagnoses() {
  return useSupabaseDB<Tables['diagnoses']['Row']>({ table: 'diagnoses' })
}

export function useTreatments() {
  return useSupabaseDB<Tables['treatments']['Row']>({ table: 'treatments' })
}

export function useMedicalEvents() {
  return useSupabaseDB<Tables['medical_events']['Row']>({ table: 'medical_events' })
}

export function useMedicalDocuments() {
  return useSupabaseDB<Tables['medical_documents']['Row']>({ table: 'medical_documents' })
}

export function useAppointments() {
  return useSupabaseDB<Tables['appointments']['Row']>({ table: 'appointments' })
}

export function useReminders() {
  return useSupabaseDB<Tables['reminders']['Row']>({ table: 'reminders' })
}

export function useMedicalNotes() {
  return useSupabaseDB<Tables['medical_notes']['Row']>({ table: 'medical_notes' })
}

export function useEmergencyEvents() {
  return useSupabaseDB<Tables['emergency_events']['Row']>({ table: 'emergency_events' })
}

export function useEmergencyContacts() {
  return useSupabaseDB<Tables['emergency_contacts']['Row']>({ table: 'emergency_contacts' })
} 