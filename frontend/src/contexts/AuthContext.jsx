import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('researchai_token');
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem('researchai_token'))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      async login(payload) {
        const res = await api.post('/auth/login', payload);
        localStorage.setItem('researchai_token', res.data.token);
        setUser(res.data.user);
        return res.data.user;
      },
      async register(payload) {
        const res = await api.post('/auth/register', payload);
        localStorage.setItem('researchai_token', res.data.token);
        setUser(res.data.user);
        return res.data.user;
      },
      logout() {
        localStorage.removeItem('researchai_token');
        setUser(null);
      }
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
