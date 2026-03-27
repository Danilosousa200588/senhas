/**
 * src/lib/supabase.ts
 * Cliente Supabase — inicializado com variáveis de ambiente.
 * A chave anon é pública (segura para frontend), mas o RLS garante
 * que cada usuário só acessa seus próprios dados.
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não definidas no .env'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persiste a sessão no localStorage do browser automaticamente
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
