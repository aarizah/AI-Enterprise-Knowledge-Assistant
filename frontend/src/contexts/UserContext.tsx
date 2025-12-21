"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { settings } from "@/lib/settings";

interface User {
  id: number;
  username: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  clearUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${settings.backendUrl}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      setUser(data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const clearUser = () => {
    setUser(null);
    setError(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, error, fetchUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
