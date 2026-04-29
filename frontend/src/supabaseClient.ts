import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Thiếu biến môi trường Supabase. Kiểm tra file .env')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export const getAvatarUrl = (filename: string) => {
  const { data } = supabase.storage.from('avatars').getPublicUrl(filename)
  return data.publicUrl
}