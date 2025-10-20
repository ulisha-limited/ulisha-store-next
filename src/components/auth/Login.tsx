/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

export default function Login({ isMobile }: { isMobile: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const signIn = useAuthStore((state) => state.signIn);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      window.location.href = "/";
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during sign in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: "google" | "azure") => {
    await supabase.auth.signInWithOAuth({ provider });
  };

  const handleGoogleSignIn = () => handleOAuthSignIn("google");
  const handleMicrosoftSignIn = () => handleOAuthSignIn("azure");

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen mx-auto">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex-col justify-center p-5 hidden lg:flex">
        <Link href="https://ulishastore.com/web">
          <Image
            src="/images/android-qrcode.svg"
            alt="Scan to download the Ulisha Store App"
            width="250"
            height="250"
          />
          <h1 className="text-1xl sm:text-3xl font-extrabold text-gray-900 mb-2">
            Get the Ulisha Store App Today!
          </h1>
          <p className="text-orange-500 font-medium mt-2">
            Shop smarter, save more — unlock exclusive deals with up to{" "}
            <span className="font-bold">20% off</span> on every purchase.
          </p>
          <p className="text-gray-600 mt-2 text-sm">
            Quick, secure, and convenient shopping — all at your fingertips.
          </p>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto w-full sm:max-w-md p-5">
        <div
          className={`${!isMobile && "border border-gray-200 shadow-xl rounded-lg"} bg-white py-8 px-4 sm:px-10`}
        >
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
              Hello, welcome back!
            </h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
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
                  className="text-gray-600 pl-10 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange focus:ring-primary-orange"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FontAwesomeIcon
                  icon={faLock}
                  className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-orange-500 focus:ring-primary-orange border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-orange-500 hover:text-orange-600"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-orange transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full inline-flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4285F4]"
                  type="button"
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
                  <span>Google</span>
                </button>
              </div>
              <div>
                <button
                  onClick={handleMicrosoftSignIn}
                  className="w-full inline-flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2F2FEE]"
                  type="button"
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <rect fill="#F35325" x="1" y="1" width="10" height="10" />
                    <rect fill="#81BC06" x="13" y="1" width="10" height="10" />
                    <rect fill="#05A6F0" x="1" y="13" width="10" height="10" />
                    <rect fill="#FFBA08" x="13" y="13" width="10" height="10" />
                  </svg>
                  <span>Microsoft</span>
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="text-orange-500 hover:text-orange-500/90"
                  >
                    Sign up
                  </Link>
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-5">
            This site is protected by reCAPTCHA and the Google{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>{" "}
            and{" "}
            <a
              href="https://policies.google.com/terms"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service
            </a>{" "}
            apply.
          </p>
        </div>
      </div>
    </div>
  );
}
