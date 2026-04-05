import { createClient } from '@supabase/supabase-js'
import type { SupabaseEnv } from '@/lib/types'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
const isDev = import.meta.env.DEV

export const hasSupabaseEnv = Boolean(url && anonKey)
export const canUseDemoData = isDev && !hasSupabaseEnv
export const supabaseConfigError =
  !hasSupabaseEnv && !isDev
    ? 'Supabase is not configured in production. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    : null

export const getSupabaseEnv = (): SupabaseEnv | null => {
  if (!url || !anonKey) {
    return null
  }

  return { url, anonKey }
}

export const supabase = hasSupabaseEnv
  ? createClient(url!, anonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null
