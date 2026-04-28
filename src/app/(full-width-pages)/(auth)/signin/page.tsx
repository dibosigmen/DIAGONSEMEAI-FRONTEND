import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";
import { AuthProvider } from "@/context/auth";

export const metadata: Metadata = {
  title: "SignIn",
};

export default function SignIn() {
  return (
    <AuthProvider>
      <SignInForm />
    </AuthProvider>
  );
}