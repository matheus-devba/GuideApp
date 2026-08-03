import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY // Recomendado usar a Service Role no backend

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)