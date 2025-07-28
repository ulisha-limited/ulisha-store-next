"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ShoppingBag, Chrome, Monitor } from "lucide-react"; // Import Chrome and Monitor icons
import { useAuthStore } from "@/store/authStore";
import { PasswordStrengthMeter } from "@/components/PasswordStrengthMeter";
import { supabase } from "@/lib/supabase";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const router = useRouter();
  const navigate = router.push;
  const signUp = useAuthStore((state) => state.signUp);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Check password strength
    if (passwordStrength < 3) {
      setError("Please choose a stronger password");
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, name);
      navigate("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: "google" | "azure") => {
    await supabase.auth.signInWithOAuth({ provider });
  };

  const handleGoogleSignUp = () => handleOAuthSignIn("google");
  const handleMicrosoftSignUp = () => handleOAuthSignIn("azure");

  return (
    <div className="flex flex-col lg:flex-row justify-center m-5">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col justify-center min-h-[220px]">
        <div className="flex flex-col items-center text-center mb-6 justify-center flex-1">
          <div className="flex justify-center">
            <ShoppingBag className="h-12 w-12 text-orange-500" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
            Create your UlishaStore account
          </h2>
          <p className="text-gray-600">Join our community today</p>
          <p className="text-orange-500 font-medium mt-2">
            Enjoy up to 20% discounts on all products!
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 sm:px-10 shadow-xl rounded-lg border border-gray-200">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <div className="mt-1 relative">
                <input
                  id="name"
                  type="text"
                  required
                  className="pl-10 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-orange focus:ring-primary-orange"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <User className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  type="email"
                  required
                  className="pl-10 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-orange focus:ring-primary-orange"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type="password"
                  required
                  className="pl-10 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-orange focus:ring-primary-orange"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              <PasswordStrengthMeter
                password={password}
                onStrengthChange={setPasswordStrength}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  className={`pl-10 block w-full rounded-md border ${
                    confirmPassword && password !== confirmPassword
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-primary-orange focus:ring-primary-orange"
                  } px-3 py-2 shadow-sm`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  Passwords do not match
                </p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-orange-500 focus:ring-primary-orange border-gray-300 rounded"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-700"
              >
                I agree to the{" "}
                <a
                  href="/terms"
                  className="text-orange-500 hover:text-orange-500/90"
                >
                  Terms
                </a>
                ,{" "}
                <a
                  href="/privacy"
                  className="text-orange-500 hover:text-orange-500/90"
                >
                  Privacy
                </a>{" "}
                and{" "}
                <a
                  href="/returns"
                  className="text-orange-500 hover:text-orange-500/90"
                >
                  Returns Policy
                </a>
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="subscribe"
                name="subscribe"
                type="checkbox"
                required
                className="h-4 w-4 text-orange-500 focus:ring-primary-orange border-gray-300 rounded"
              />
              <label
                htmlFor="subscribe"
                className="ml-2 block text-sm text-gray-700"
              >
                I agree to receive promotional, marketing, and other
                communications from UlishaStore.
              </label>
            </div>

            <button
              type="submit"
              disabled={
                loading || password !== confirmPassword || passwordStrength < 3
              }
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-orange transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* --- New Social Sign-up Section --- */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or sign up with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <button
                  onClick={handleGoogleSignUp}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Chrome className="h-5 w-5 mr-2" />
                  <span>Sign up with Google</span>
                </button>
              </div>
              <div>
                <button
                  onClick={handleMicrosoftSignUp}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Monitor className="h-5 w-5 mr-2" />
                  <span>Sign up with Microsoft</span>
                </button>
              </div>
            </div>
          </div>
          {/* --- End Social Sign-up Section --- */}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-orange-500 hover:text-orange-500/90"
                  >
                    Sign in
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
