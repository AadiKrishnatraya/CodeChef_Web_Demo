import { useCallback, useEffect, useState } from 'react';

export function useAuth() {
  const [admin, setAdmin] = useState(() => {
    try {
      const raw = localStorage.getItem('cc_admin');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback((token, user) => {
    localStorage.setItem('cc_admin', JSON.stringify({ token, user }));
    setAdmin({ token, user });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('cc_admin');
    setAdmin(null);
  }, []);

  return { admin, login, logout, isAdmin: Boolean(admin) };
}
