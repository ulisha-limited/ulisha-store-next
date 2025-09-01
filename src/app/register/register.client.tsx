/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faUser,
  faBagShopping,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "@/store/authStore";
import { PasswordStrengthMeter } from "@/components/PasswordStrengthMeter";
import { supabase } from "@/lib/supabase";
import axios from "axios";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("/api/auth/register", {
        email,
        password,
        confirmPassword,
        name,
      });

      navigate("/login");
    } catch (err: any) {
      if (err.response) {
        setError(
          err.response.data.error ||
            "An error occurred during sign in. Please try again.",
        );
      } else if (err.request) {
        setError("No response from server. Please try again.");
      } else {
        setError(err.message);
      }
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
        <Link
          href="/"
          className="flex flex-col items-center text-center mb-6 justify-center flex-1"
        >
          <div className="flex justify-center">
            <FontAwesomeIcon
              icon={faBagShopping}
              className=" text-orange-500"
              size="4x"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
            Create your UlishaStore account
          </h2>
          <p className="text-gray-600">Join our community today</p>
          <p className="text-orange-500 font-medium mt-2">
            Enjoy up to 20% discounts on all products!
          </p>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 sm:px-10 shadow-xl rounded-lg border border-gray-200">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
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
                  className="text-gray-600 pl-10 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-orange focus:ring-primary-orange"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <FontAwesomeIcon
                  icon={faUser}
                  className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                />
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
                  className="text-gray-600 pl-10 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-orange focus:ring-primary-orange"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                />
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
                  className="text-gray-600 pl-10 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-orange focus:ring-primary-orange"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FontAwesomeIcon
                  icon={faLock}
                  className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                />
              </div>
              {password && (
                <PasswordStrengthMeter
                  password={password}
                  onStrengthChange={setPasswordStrength}
                />
              )}
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
                  className={`text-gray-600 pl-10 block w-full rounded-md border ${
                    confirmPassword && password !== confirmPassword
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-primary-orange focus:ring-primary-orange"
                  } px-3 py-2 shadow-sm`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <FontAwesomeIcon
                  icon={faLock}
                  className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                />
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
                <Link
                  href="/legal/terms"
                  className="text-orange-500 hover:text-orange-500/90"
                >
                  Terms
                </Link>
                ,{" "}
                <Link
                  href="/legal/privacy-policy"
                  className="text-orange-500 hover:text-orange-500/90"
                >
                  Privacy
                </Link>{" "}
                and{" "}
                <Link
                  href="/legal/return-policy"
                  className="text-orange-500 hover:text-orange-500/90"
                >
                  Return Policy
                </Link>
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
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 48 48">
                    <g>
                      <path
                        fill="#4285F4"
                        d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.87-6.87C36.13 2.36 30.45 0 24 0 14.82 0 6.73 5.82 2.69 14.29l7.98 6.2C12.47 13.98 17.77 9.5 24 9.5z"
                      />
                      <path
                        fill="#34A853"
                        d="M46.14 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.44c-.54 2.9-2.17 5.36-4.62 7.01l7.19 5.59C43.97 37.45 46.14 31.54 46.14 24.55z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M10.67 28.49a14.5 14.5 0 0 1 0-9.01l-7.98-6.2A24.01 24.01 0 0 0 0 24c0 3.77.9 7.34 2.69 10.51l7.98-6.02z"
                      />
                      <path
                        fill="#EA4335"
                        d="M24 48c6.45 0 12.13-2.13 16.19-5.8l-7.19-5.59c-2.01 1.35-4.59 2.15-9 2.15-6.23 0-11.53-4.48-13.33-10.49l-7.98 6.02C6.73 42.18 14.82 48 24 48z"
                      />
                      <path fill="none" d="M0 0h48v48H0z" />
                    </g>
                  </svg>
                  <span>Sign up with Google</span>
                </button>
              </div>
              <div>
                <button
                  onClick={handleMicrosoftSignUp}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <rect fill="#F35325" x="1" y="1" width="10" height="10" />
                    <rect fill="#81BC06" x="13" y="1" width="10" height="10" />
                    <rect fill="#05A6F0" x="1" y="13" width="10" height="10" />
                    <rect fill="#FFBA08" x="13" y="13" width="10" height="10" />
                  </svg>
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
