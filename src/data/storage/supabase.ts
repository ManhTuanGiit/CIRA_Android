import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

const supabaseUrl = SUPABASE_URL ?? '';
const supabaseAnonKey = SUPABASE_ANON_KEY ?? '';

if (__DEV__ && (!supabaseUrl || !supabaseAnonKey)) {
  console.warn('[Supabase] Missing environment variables. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  // Disable realtime to prevent Android crash:
  // "Cannot assign to property 'protocol' which has only a getter"
  // Remove this line only after adding react-native-url-polyfill (already added)
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
