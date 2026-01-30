import { createClient } from '@supabase/supabase-js';
import { getEnvVariables } from '../helpers';

const { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } = getEnvVariables();

export const supabase = createClient(
  VITE_SUPABASE_URL || 'https://placeholder.supabase.co',
  VITE_SUPABASE_ANON_KEY || 'placeholder-key'
);

export default supabase;
