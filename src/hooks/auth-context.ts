import { createContext } from "react";
import type { Profile } from "@/lib/types";

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: Error }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role?: "admin" | "staff"
  ) => Promise<{ error?: Error }>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
