import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";
import { AuthProvider } from "@/context/auth";

export const metadata: Metadata = {
  title: "SignUp",
};

export default function SignUp() {
  return (
    <AuthProvider>
      <SignUpForm />
    </AuthProvider>
  );
}