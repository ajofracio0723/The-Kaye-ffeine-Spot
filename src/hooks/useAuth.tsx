import { useContext, useEffect, useState } from "react";
import type { Profile } from "@/lib/types";
import {
  getProfileByUserId,
  getSessionUserId,
  getUserById,
  signInLocal,
  signOutLocal,
  signUpLocal,
} from "@/lib/storage";
import { AuthContext, type AuthUser } from "./auth-context";

export { AuthContext } from "./auth-context";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const userId = getSessionUserId();
      if (userId) {
        const localUser = getUserById(userId);
        const localProfile = getProfileByUserId(userId);
        if (localUser && localProfile) {
          setUser({ id: localUser.id, email: localUser.email });
          setProfile(localProfile);
        } else {
          signOutLocal();
        }
      }
    } catch (error) {
      console.error("Failed to restore session:", error);
      signOutLocal();
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { user: localUser, profile: localProfile } = signInLocal(email, password);
      setUser({ id: localUser.id, email: localUser.email });
      setProfile(localProfile);
      return {};
    } catch (err) {
      return { error: err instanceof Error ? err : new Error("Sign in failed") };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: "admin" | "staff" = "staff"
  ) => {
    try {
      const { user: localUser, profile: localProfile } = signUpLocal(
        email,
        password,
        fullName,
        role
      );
      setUser({ id: localUser.id, email: localUser.email });
      setProfile(localProfile);
      return {};
    } catch (err) {
      return { error: err instanceof Error ? err : new Error("Sign up failed") };
    }
  };

  const signOut = async () => {
    signOutLocal();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
