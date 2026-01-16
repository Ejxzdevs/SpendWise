import React, { createContext, useState, useEffect, ReactNode } from "react";
import { AuthContextType } from "@/types/auth";
import { jwtDecode } from "jwt-decode";
import { router } from "expo-router";
import {
  setUserToken,
  setUserInfo,
  getUserToken,
  getUserInfo,
  removeUserToken,
  removeUserInfo,
} from "@/utils/authStorage";

export const AuthContext = createContext<AuthContextType>({
  userToken: null,
  username: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userToken, setUserTokenState] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isTokenExpired = (token: string) => {
    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      return Date.now() >= exp * 1000;
    } catch {
      return true;
    }
  };

  useEffect(() => {
    const loadToken = async () => {
      const token = await getUserToken();
      const userInfo = await getUserInfo();

      if (!token || isTokenExpired(token)) {
        await removeUserToken();
        await removeUserInfo();
        setUserTokenState(null);
        router.replace("/(auth)/login");
      } else {
        setUserTokenState(token);
        setUsername(userInfo ? JSON.parse(userInfo).username : null);
      }

      setLoading(false);
    };

    loadToken();
  }, []);

  const login = async (
    token: string,
    user: { id: string; username: string }
  ) => {
    setUserInfo(user);
    setUsername(user.username);
    setUserToken(token);
    setUserTokenState(token);
    router.replace("/(app)/(tabs)");
  };

  const logout = async () => {
    await removeUserToken();
    await removeUserInfo();
    setUserTokenState(null);
    setUsername(null);
    router.replace("/(auth)/login");
  };

  return (
    <AuthContext.Provider
      value={{ userToken, username, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
