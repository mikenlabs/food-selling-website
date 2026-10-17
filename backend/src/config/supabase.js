import { createClient } from '@supabase/supabase-js'
import { config } from './environment.js'

const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey)

export default supabase