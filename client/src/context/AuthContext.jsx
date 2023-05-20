import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  fetchMe,
  login as apiLogin,
  register as apiRegister,
  setStoredToken,
  getStoredToken,
  setUnauthorizedHandler,
} from "../api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setStoredToken(null);

    setUser(null);
  }, []);

  const loadUser = useCallback(async () => {
    const token = getStoredToken();

    if (!token) {
      setUser(null);

      setLoading(false);

      return;
    }

    try {
      const data = await fetchMe();

      setUser(data.user);
    } catch {
      setStoredToken(null);

      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(logout);

    loadUser();
  }, [loadUser, logout]);

  const login = useCallback(async (email, password) => {
    const data = await apiLogin(email, password);

    setStoredToken(data.token);

    setUser(data.user);

    return data;
  }, []);

  const register = useCallback(async (email, password) => {
    const data = await apiRegister(email, password);

    setStoredToken(data.token);

    setUser(data.user);

    return data;
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [user, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
}
