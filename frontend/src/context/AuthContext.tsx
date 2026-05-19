import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { apiUrl, parseApiError } from "@/lib/api";

interface AuthUser {
  name: string;
  email: string;
  picture?: string;
  id?: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  isAdmin: boolean;
  isLoading: boolean;
  loginWithGoogle: (credential: string) => Promise<boolean>;
  loginWithCredentials: (email: string, password: string) => Promise<boolean>;
  registerWithCredentials: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const parseJwtPayload = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = window.atob(base64);
    return JSON.parse(payload) as { name?: string; email?: string; picture?: string };
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isAdmin = Boolean(user?.email?.toLowerCase() === "admin@gmail.com");

  const checkSession = async () => {
    try {
      const response = await fetch(apiUrl("/auth/verify"), {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Session verification failed:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const loginWithGoogle = async (credential: string) => {
    if (!credential) return false;
    const payload = parseJwtPayload(credential);
    if (!payload?.email || !payload?.name) return false;

    try {
      const response = await fetch(apiUrl("/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
          provider: "google",
        }),
      });

      if (!response.ok) throw new Error(await parseApiError(response));

      const data = await response.json();
      setUser(data.user || { name: payload.name, email: payload.email });
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Google login failed:", error);
      return false;
    }
  };

  const loginWithCredentials = async (email: string, password: string) => {
    try {
      const response = await fetch(apiUrl("/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password.trim(),
          provider: "credentials",
        }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      setUser(data.user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Credentials login failed:", error);
      return false;
    }
  };

  const registerWithCredentials = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(apiUrl("/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: password.trim(),
        }),
      });

      if (!response.ok) throw new Error(await parseApiError(response));

      const data = await response.json();
      setUser(data.user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch(apiUrl("/auth/logout"), {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isAdmin,
        isLoading,
        loginWithGoogle,
        loginWithCredentials,
        registerWithCredentials,
        logout,
        checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

