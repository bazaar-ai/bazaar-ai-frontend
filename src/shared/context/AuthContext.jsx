import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken as persistAccessToken,
} from "../utils/tokenStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessTokenState] = useState(() => getAccessToken());

  const login = useCallback((token) => {
    persistAccessToken(token);
    setAccessTokenState(token);
  }, []);

  const logout = useCallback(() => {
    clearAccessToken();
    setAccessTokenState(null);
  }, []);

  const value = useMemo(
    () => ({
      accessToken,
      isAuthenticated: Boolean(accessToken),
      login,
      logout,
    }),
    [accessToken, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
