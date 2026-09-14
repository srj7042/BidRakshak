"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  designation: string;
  department: string;
  role: "PROCUREMENT_OFFICER" | "AUDITOR" | "ADMIN";
  organization: string;
  nodalCode: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: Partial<UserProfile> & { password?: string }) => Promise<void>;
  logout: () => void;
  verifyOtp: (code: string) => Promise<boolean>;
  completeOnboarding: (data: { orgName: string; department: string; nodalCode: string }) => void;
}

const DEFAULT_OFFICER: UserProfile = {
  id: "usr-849201",
  email: "anita.roy@gov.in",
  fullName: "Dr. Anita Roy, IAS",
  designation: "Chief Nodal Officer",
  department: "Ministry of Electronics & IT (MeitY)",
  role: "PROCUREMENT_OFFICER",
  organization: "Government of India",
  nodalCode: "NIC-DELHI-04",
};

const AuthContext = createContext<AuthContextType>({
  user: DEFAULT_OFFICER,
  isAuthenticated: true,
  isLoading: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  verifyOtp: async () => true,
  completeOnboarding: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(DEFAULT_OFFICER);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const savedUser = localStorage.getItem("bidrakshak_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(DEFAULT_OFFICER);
      }
    } else {
      setUser(DEFAULT_OFFICER);
    }
  }, []);

  const login = async (email: string) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 400));
    const loggedInUser: UserProfile = {
      ...DEFAULT_OFFICER,
      email: email || DEFAULT_OFFICER.email,
    };
    setUser(loggedInUser);
    localStorage.setItem("bidrakshak_user", JSON.stringify(loggedInUser));
    setIsLoading(false);
    router.push("/dashboard");
  };

  const register = async (data: Partial<UserProfile> & { password?: string }) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 400));
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email: data.email || "officer@gov.in",
      fullName: data.fullName || "Procurement Officer",
      designation: data.designation || "Nodal Officer",
      department: data.department || "Government Department",
      role: "PROCUREMENT_OFFICER",
      organization: "Government of India",
      nodalCode: "NIC-NODE-01",
    };
    setUser(newUser);
    localStorage.setItem("bidrakshak_user", JSON.stringify(newUser));
    setIsLoading(false);
    router.push("/verify-email");
  };

  const verifyOtp = async (code: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 300));
    setIsLoading(false);
    return true;
  };

  const completeOnboarding = (data: { orgName: string; department: string; nodalCode: string }) => {
    if (user) {
      const updatedUser: UserProfile = {
        ...user,
        organization: data.orgName,
        department: data.department,
        nodalCode: data.nodalCode,
      };
      setUser(updatedUser);
      localStorage.setItem("bidrakshak_user", JSON.stringify(updatedUser));
      router.push("/dashboard");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("bidrakshak_user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        verifyOtp,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
