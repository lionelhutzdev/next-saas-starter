import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side / anon-key client. Use this from client components for the
// initial write. Never import the service role key here.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
