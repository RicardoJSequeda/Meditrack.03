import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
}

export function useSupabaseAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    // Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          setAuthState(prev => ({ ...prev, error: error.message, loading: false }))
          return
        }

        setAuthState({
          user: session?.user ?? null,
          session,
          loading: false,
          error: null
        })
      } catch (error) {
        setAuthState(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error.message : 'Error desconocido', 
          loading: false 
        }))
      }
    }

    getInitialSession()

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthState({
          user: session?.user ?? null,
          session,
          loading: false,
          error: null
        })
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })

      if (error) {
        setAuthState(prev => ({ ...prev, error: error.message, loading: false }))
        return { error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return { error: errorMessage }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setAuthState(prev => ({ ...prev, error: error.message, loading: false }))
        return { error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return { error: errorMessage }
    }
  }

  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))
      
      const { error } = await supabase.auth.signOut()

      if (error) {
        setAuthState(prev => ({ ...prev, error: error.message, loading: false }))
        return { error: error.message }
      }

      setAuthState({
        user: null,
        session: null,
        loading: false,
        error: null
      })

      return { error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return { error: errorMessage }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) {
        setAuthState(prev => ({ ...prev, error: error.message, loading: false }))
        return { error: error.message }
      }

      setAuthState(prev => ({ ...prev, loading: false }))
      return { error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return { error: errorMessage }
    }
  }

  const updatePassword = async (password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))
      
      const { error } = await supabase.auth.updateUser({
        password
      })

      if (error) {
        setAuthState(prev => ({ ...prev, error: error.message, loading: false }))
        return { error: error.message }
      }

      setAuthState(prev => ({ ...prev, loading: false }))
      return { error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return { error: errorMessage }
    }
  }

  const updateProfile = async (updates: any) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))
      
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      })

      if (error) {
        setAuthState(prev => ({ ...prev, error: error.message, loading: false }))
        return { error: error.message }
      }

      setAuthState(prev => ({ 
        ...prev, 
        user: data.user, 
        loading: false 
      }))

      return { data, error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return { error: errorMessage }
    }
  }

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile
  }
} 