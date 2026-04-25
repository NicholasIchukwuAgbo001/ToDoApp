import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types/auth";
import { loginUser, registerUser, googleSignIn } from "../services/authService";

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  googleLogin: (idToken: string) => Promise<{ ok: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = "@taskly_user";
const TOKEN_KEY = "@taskly_access_token";
const REFRESH_KEY = "@taskly_refresh_token";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const [storedUser, storedToken] = await Promise.all([
        AsyncStorage.getItem(USER_KEY),
        AsyncStorage.getItem(TOKEN_KEY),
      ]);
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setAccessToken(storedToken);
      }
    } catch (err) {
      console.error("Failed to restore session:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const result = await loginUser({ email, password });
    if (!result.ok) {
      const errorMap: Record<number, string> = {
        401: "Invalid email or password",
        403: "Please verify your email before signing in",
        404: "No account found with this email",
      };
      return { ok: false, message: errorMap[result.statusCode] ?? result.message };
    }

    const { user: apiUser, accessToken: token, refreshToken } = result;
    setUser(apiUser);
    setAccessToken(token);
    await Promise.all([
      AsyncStorage.setItem(USER_KEY, JSON.stringify(apiUser)),
      AsyncStorage.setItem(TOKEN_KEY, token),
      AsyncStorage.setItem(REFRESH_KEY, refreshToken),
    ]);
    return { ok: true };
  };

  const signup = async (firstName: string, lastName: string, email: string, password: string) => {
    const result = await registerUser({ firstName, lastName, email, password });
    if (!result.ok) {
      const errorMap: Record<number, string> = {
        409: "An account with this email already exists",
        400: "Please check your details and try again",
      };
      return { ok: false, message: errorMap[result.statusCode] ?? result.message };
    }
    return { ok: true, message: result.message };
  };

  const logout = async () => {
    setUser(null);
    setAccessToken(null);
    await AsyncStorage.multiRemove([USER_KEY, TOKEN_KEY, REFRESH_KEY]);
  };

  const googleLogin = async (idToken: string) => {
    const result = await googleSignIn(idToken);
    if (!result.ok) {
      return { ok: false, message: result.message };
    }
    const { user: apiUser, accessToken: token, refreshToken } = result;
    setUser(apiUser);
    setAccessToken(token);
    await Promise.all([
      AsyncStorage.setItem(USER_KEY, JSON.stringify(apiUser)),
      AsyncStorage.setItem(TOKEN_KEY, token),
      AsyncStorage.setItem(REFRESH_KEY, refreshToken),
    ]);
    return { ok: true };
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, login, signup, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
