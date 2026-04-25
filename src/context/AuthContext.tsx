import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = "@todo_app_user";
const USERS_STORAGE_KEY = "@todo_app_users";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const users: Array<{
        email: string;
        password: string;
        name: string;
        id: string;
      }> = usersJson ? JSON.parse(usersJson) : [];

      const foundUser = users.find(
        (u) => u.email === email && u.password === password,
      );

      if (foundUser) {
        const loggedInUser: User = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
        };
        setUser(loggedInUser);
        await AsyncStorage.setItem(
          USER_STORAGE_KEY,
          JSON.stringify(loggedInUser),
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const users: Array<{
        email: string;
        password: string;
        name: string;
        id: string;
      }> = usersJson ? JSON.parse(usersJson) : [];

      const existingUser = users.find((u) => u.email === email);
      if (existingUser) {
        return false;
      }

      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        name,
      };

      users.push(newUser);
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

      const createdUser: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      };
      setUser(createdUser);
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(createdUser));
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
