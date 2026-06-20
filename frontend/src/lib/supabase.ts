import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

let _client: any = null

function ensureClient() {
  if (!_client) {
    const url = 'https://awvbianvsdrzvvbnauyo.supabase.co'
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY não configurada')
    _client = createClient<Database>(url, key)
  }
  return _client
}

export function requireSupabase() {
  return ensureClient()
}
