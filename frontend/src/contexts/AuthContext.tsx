import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { Usuario } from '../types';

interface AuthContextType {
  user: Usuario | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  registerUser: (data: { nome: string; email: string; senha: string; telefone?: string; objetivo?: string }) => Promise<void>;
  logout: () => void;
  switchDemoUser: (targetEmail: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('move_plus_token');
      if (!token) {
        // Auto-login como Ana Souza para facilitar a navegação inicial
        await login('ana@moveplus.com', 'senha123');
        return;
      }
      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      console.warn('Sessão expirada ou usuário não logado.');
      localStorage.removeItem('move_plus_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, senha: string) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, senha });
      const { token, usuario } = response.data;
      localStorage.setItem('move_plus_token', token);
      setUser(usuario);
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (data: { nome: string; email: string; senha: string; telefone?: string; objetivo?: string }) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', data);
      const { token, usuario } = response.data;
      localStorage.setItem('move_plus_token', token);
      setUser(usuario);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('move_plus_token');
    setUser(null);
  };

  const switchDemoUser = async (targetEmail: string) => {
    const passwordMap: Record<string, string> = {
      'ana@moveplus.com': 'senha123',
      'bruno@moveplus.com': 'senha123',
      'admin@moveplus.com': 'admin123'
    };
    const password = passwordMap[targetEmail] || 'senha123';
    await login(targetEmail, password);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, registerUser, logout, switchDemoUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
