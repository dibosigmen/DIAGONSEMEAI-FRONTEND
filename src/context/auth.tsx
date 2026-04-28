"use client";

import {
  createContext,
  useEffect,
  useState,
  useContext,
  ReactNode,
} from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../supabase";

/* ================= TYPES ================= */

type AuthContextType = {
  session: Session | null;

  signUp: (email: string, password: string) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;

  verifyOtp: (email: string, otp: string) => Promise<string | null>;
  resendOtp: (email: string) => Promise<string | null>;

  forgotPassword: (email: string) => Promise<string | null>;
};

/* ================= CONTEXT ================= */

const AuthContext = createContext<AuthContextType | null>(null);

/* ================= PROVIDER ================= */

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);

  /* ---------- SESSION LISTENER ---------- */
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  /* ================= AUTH ACTIONS ================= */

  /* ---------- SIGN UP ---------- */
  const signUp = async (email: string, password: string) => {
    try {
      const redirectUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/`
          : undefined;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      // On self-hosted Supabase setups, a bad redirect URL can produce 500 for signup.
      // Keep signup simple, then page-based profile completion can handle next steps.

      if (error) {
        console.error("Signup error:", error);
        return error.message;
      }

      console.log("Signup success:", data);

      // If Postgres policy requires confirmation (default), session may be null.
      // Navigate to profile completion page anyway; there we can show instructions.
      window.location.href = "/info";

      return null;
    } catch (err: any) {
      console.error("Signup exception:", err);
      return err.message || "Signup failed";
    }
  };

  /* ---------- SIGN IN ---------- */
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        return error.message;
      }
 
      return null;
    } catch (err: any) {
      console.error("Login exception:", err);
      return err.message || "Login failed";
    }
  };

  /* ---------- SIGN OUT ---------- */
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  /* ---------- VERIFY OTP ---------- */
  const verifyOtp = async (email: string, otp: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });

      if (error) {
        console.error("OTP verify error:", error);
        return error.message;
      }

      return null;
    } catch (err: any) {
      console.error("OTP exception:", err);
      return err.message || "OTP verification failed";
    }
  };

  /* ---------- RESEND OTP ---------- */
  const resendOtp = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });

      if (error) {
        console.error("Resend OTP error:", error);
        return error.message;
      }

      alert("OTP resent successfully 📧");
      return null;
    } catch (err: any) {
      console.error("Resend OTP exception:", err);
      return err.message || "Resend OTP failed";
    }
  };

  /* ---------- FORGOT PASSWORD ---------- */
  const forgotPassword = async (email: string) => {
    try {
      const redirectUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/reset-password`
          : undefined;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        console.error("Password reset error:", error);
        return error.message;
      }

      alert("Password reset link sent 📧");
      return null;
    } catch (err: any) {
      console.error("Password reset exception:", err);
      return err.message || "Password reset failed";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        signUp,
        signIn,
        signOut,
        verifyOtp,
        resendOtp,
        forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ================= CUSTOM HOOK ================= */

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
