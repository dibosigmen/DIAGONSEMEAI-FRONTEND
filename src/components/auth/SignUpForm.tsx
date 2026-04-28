"use client";

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import {
  ChevronLeftIcon,
  EyeCloseIcon,
  EyeIcon,
} from "@/icons";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import { supabase } from "@/supabase";

export default function SignUpForm() {
  const router = useRouter();

  const { signUp, forgotPassword } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= LOGIN ================= */

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Enter email & password");
      setLoading(false);
      return;
    }

    const err = await signUp(email, password);

    if (err) {
      setError(err);
      setLoading(false);
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { data: profile } = await supabase
          .from("usr2")
          .select("username")
          .eq("id", session.user.id)
          .single();
        
        if (profile?.username) {
          localStorage.setItem("username", profile.username);
        }
      }
    } catch (e) {
      console.error("Failed to fetch username:", e);
    }

    // Auth context handles the redirect
    setLoading(false);
  };

  /* ================= FORGOT ================= */

  const handleForgot = async () => {
    if (!email) {
      setError("Enter email first");
      return;
    }

    const err = await forgotPassword(email);

    if (err) setError(err);
    else alert("Reset link sent");
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">

      {/* Back */}
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
      
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">

        <div>
          <div className="mb-6">
          <h1 className="
            text-3xl
            font-bold
            text-blue-600
        
            first-letter:text-5xl
            first-letter:font-extrabold
            first-letter:text-blue-800
            ">
              DiagnoseMe AI
            </h1>
            
            </div>

          <div className="mb-6">
            <h1 className="text-2xl font-semibold">
              Sign up 
            </h1>

            <p className="text-sm text-gray-500">
              Enter your email and password
            </p>
          </div>

          {/* FORM */}

          <form onSubmit={handleSubmit}>

            <div className="space-y-5">

              {/* EMAIL */}

              <div>
                <Label>Email</Label>

                <Input
                  type="email"
                  placeholder="info@gmail.com"
                  onChange={(e: any) =>
                    setEmail(e.target.value)
                  }
                />
              </div>

              {/* PASSWORD */}

              <div>
                <Label>Password</Label>

                <div className="relative">

                  <Input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter password"
                    onChange={(e: any) =>
                      setPassword(
                        e.target.value
                      )
                    }
                  />

                  <span
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeIcon />
                    ) : (
                      <EyeCloseIcon />
                    )}
                  </span>

                </div>
              </div>

              {/* remember + forgot */}

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <Checkbox
                    checked={isChecked}
                    onChange={setIsChecked}
                  />

                  <span className="text-sm">
                    Keep me logged in
                  </span>

                </div>

                <button
                  type="button"
                  onClick={handleForgot}
                  className="text-sm text-blue-500"
                >
                  Forgot password?
                </button>

              </div>

              {/* ERROR */}

              {error && (
                <p className="text-red-500 text-sm">
                  {error}
                </p>
              )}

              {/* BUTTON */}

              <Button
                className="w-full"
                size="sm"
                disabled={loading}
              >
                {loading
                  ? "Loading..."
                  : "Sign up"}
              </Button>

            </div>

          </form>

          <div className="mt-5 text-sm">

            <span>
            Already have an account?
            </span>

            <Link
              href="/signin"
              className="text-blue-500 ml-2"
            >
              Sign in
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}