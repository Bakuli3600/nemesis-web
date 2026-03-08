import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wjzypocfzjtghiyziunh.supabase.co'
const supabaseAnonKey = 'sb_publishable_5LEwCPaIpENgnAF_My13qQ_lxrPXFhF'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
