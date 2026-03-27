import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  cadastrar: (email: string, senha: string) => Promise<boolean>;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  cadastrar: async () => false,
  login: async () => false,
  logout: async () => {},
  deleteAccount: async () => false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const cadastrar = async (email: string, senha: string) => {
    try {
      const { error } = await supabase.auth.signUp({ email, password: senha });
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      return false;
    }
  };

  const login = async (email: string, senha: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const deleteAccount = async () => {
    try {
      const { error } = await supabase.rpc('delete_user');
      if (error) throw error;
      
      await supabase.auth.signOut();
      setUser(null);
      return true;
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      alert('Houve um erro ao tentar excluir sua conta.');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, cadastrar, login, logout, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
