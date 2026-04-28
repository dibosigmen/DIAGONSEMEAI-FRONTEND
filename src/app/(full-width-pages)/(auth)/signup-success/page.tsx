"use client";

import Button from "@/components/ui/button/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">
            Welcome to DiagnoseMe AI!
          </h1>
          <p className="text-gray-600">
            Your account has been created successfully
          </p>
        </div>

        {/* Message */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">
            Your account is ready to use. You can now access the DiagnoseMe AI platform and start using our AI-powered medical imaging analysis tools.
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <Button
            className="w-full"
            onClick={() => router.push("/")}
          >
            Go to Dashboard
          </Button>

          <Link href="/" className="block">
            <button className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
              View Medical Tools
            </button>
          </Link>
        </div>

        {/* Footer Link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Need help?{" "}
          <Link href="#" className="text-blue-500 hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}
