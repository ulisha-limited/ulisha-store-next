/**
 * Copyright (c) 2025 Ulisha Limited
 *
 * This file is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * You may obtain a copy of the License at:
 *
 *     https://creativecommons.org/licenses/by-nc/4.0/
 *
 */


"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faUser,
  faShieldAlt,
  faEye,
  faEyeSlash,
  faEnvelope,
  faCircleChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabase";
import OtpInput from "@/components/OtpInput";
import Link from "next/link";
import { toast } from "react-toastify";

export default function AccountSecurityPage() {
  const [loading, setLoading] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "", // Note: Supabase doesn't verify current password directly for `updateUser`
    newPassword: "",
    confirmPassword: "",
  });
  const [otpData, setOtpData] = useState({
    otp: ["", "", "", "", "", ""],
    isVerifying: false,
    canResend: false,
    countdown: 60,
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showOtp && otpData.countdown > 0) {
      interval = setInterval(() => {
        setOtpData((prev) => {
          const newCountdown = prev.countdown - 1;
          if (newCountdown === 0) {
            return { ...prev, countdown: 0, canResend: true };
          }
          return { ...prev, countdown: newCountdown };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOtp, otpData.countdown]);

  const sendOtpForPasswordChange = async () => {
    if (!user || !user.email) {
      return toast.error("User not logged in or email not available.");
    }

    try {
      setLoading(true);
      setError(null);

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error("New passwords do not match");
      }

      if (passwordData.newPassword.length < 6) {
        throw new Error("New password must be at least 6 characters long");
      }

      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: user.email!,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: window.location.origin,
        },
      });

      if (otpError) {
        console.error("OTP send error:", otpError);
        throw new Error("Failed to send verification code. Please try again.");
      }

      setShowOtp(true);
      setOtpData({
        otp: ["", "", "", "", "", ""],
        isVerifying: false,
        canResend: false,
        countdown: 60,
      });

      toast.success("Verification code sent to your email address");
    } catch (err) {
      console.error("Error sending OTP:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to send verification code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpAndChangePassword = async () => {
    if (!user || !user.email) {
      return toast.error("User not logged in or email not available.");
    }

    try {
      setOtpData((prev) => ({ ...prev, isVerifying: true }));
      setError(null);

      const otpCode = otpData.otp.join("");

      if (otpCode.length !== 6) {
        throw new Error("Please enter the complete 6-digit verification code");
      }

      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: user.email,
        token: otpCode,
        type: "email",
      });

      if (verifyError) {
        console.error("OTP verification error:", verifyError);
        throw new Error(
          "Invalid or expired verification code. Please try again."
        );
      }

      const { error: passwordError } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (passwordError) {
        console.error("Password update error:", passwordError);
        throw new Error(
          "Failed to update password. Please try again. You might need to re-authenticate."
        );
      }

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setOtpData({
        otp: ["", "", "", "", "", ""],
        isVerifying: false,
        canResend: false,
        countdown: 60,
      });
      setShowChangePassword(false);
      setShowOtp(false);

      toast.success("Password updated successfully");
    } catch (err) {
      console.error("Error verifying OTP and updating password:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to verify code and update password"
      );
    } finally {
      setOtpData((prev) => ({ ...prev, isVerifying: false }));
    }
  };

  const resendOtp = async () => {
    if (!user || !user.email || !otpData.canResend) return;

    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signInWithOtp({
        email: user.email!,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        console.error("OTP resend error:", error);
        throw new Error(
          "Failed to resend verification code. Please try again."
        );
      }

      setOtpData((prev) => ({
        ...prev,
        canResend: false,
        countdown: 60,
        otp: ["", "", "", "", "", ""],
      }));

      toast.success("New verification code sent to your email");
    } catch (err) {
      console.error("Error resending OTP:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to resend verification code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (newOtp: string[]) => {
    setOtpData((prev) => ({ ...prev, otp: newOtp }));
  };

  const handleOtpComplete = (otpString: string) => {
    const otpArray = otpString.split("");
    setOtpData((prev) => ({ ...prev, otp: otpArray }));
    setTimeout(() => {
      verifyOtpAndChangePassword();
    }, 500);
  };

  const cancelPasswordChange = () => {
    setShowChangePassword(false);
    setShowOtp(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setOtpData({
      otp: ["", "", "", "", "", ""],
      isVerifying: false,
      canResend: false,
      countdown: 60,
    });
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {" "}
      {/* Apply font-sans here */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex items-center mb-8">
          <Link
            href="/my-account/settings"
            className="p-2 mr-4 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Go back to settings"
          >
            <FontAwesomeIcon icon={faCircleChevronLeft} className="w-6 h-6 text-gray-700" />
          </Link>
          {/* Reduced font size for the heading */}
          <h1 className="text-2xl font-extrabold text-gray-900">
            Account & Security
          </h1>
        </div>

        {(success || error) && (
          <div
            className={`p-4 rounded-md mb-4 ${
              success
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <p className="text-sm font-medium">{success || error}</p>
          </div>
        )}

        <section className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <FontAwesomeIcon icon={faLock} className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Password</p>
                    <p className="text-sm text-gray-500">
                      Change your account password with email verification
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChangePassword(!showChangePassword)}
                  className="text-primary-orange hover:text-primary-orange/90 font-medium text-sm"
                >
                  Change Password
                </button>
              </div>

              {showChangePassword && !showOtp && (
                <div className="mt-4 space-y-4 border-t pt-4">
                  <div className="bg-blue-50 p-4 rounded-md">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faShieldAlt} className="w-5 h-5 text-blue-600 mr-2" />
                      <p className="text-sm text-blue-800">
                        For your security, we&apos;ll send a verification code
                        to your email before changing your password.
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      sendOtpForPasswordChange();
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Current Password
                      </label>
                      <div className="mt-1 relative">
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          id="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              currentPassword: e.target.value,
                            })
                          }
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-orange focus:ring-primary-orange sm:text-sm"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              current: !showPasswords.current,
                            })
                          }
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          aria-label={
                            showPasswords.current
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showPasswords.current ? (
                            <FontAwesomeIcon icon={faEyeSlash} className="h-4 w-4 text-gray-400" />
                          ) : (
                            <FontAwesomeIcon icon={faEye} className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-gray-700"
                      >
                        New Password
                      </label>
                      <div className="mt-1 relative">
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          id="newPassword"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-orange focus:ring-primary-orange sm:text-sm"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              new: !showPasswords.new,
                            })
                          }
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          aria-label={
                            showPasswords.new
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showPasswords.new ? (
                            <FontAwesomeIcon icon={faEyeSlash} className="h-4 w-4 text-gray-400" />
                          ) : (
                            <FontAwesomeIcon icon={faEye} className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="confirmNewPassword"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Confirm New Password
                      </label>
                      <div className="mt-1 relative">
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          id="confirmNewPassword"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-orange focus:ring-primary-orange sm:text-sm"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              confirm: !showPasswords.confirm,
                            })
                          }
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          aria-label={
                            showPasswords.confirm
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showPasswords.confirm ? (
                            <FontAwesomeIcon icon={faEyeSlash} className="h-4 w-4 text-gray-400" />
                          ) : (
                            <FontAwesomeIcon icon={faEye} className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={cancelPasswordChange}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-500/90 disabled:opacity-50 flex items-center space-x-2 text-sm"
                      >
                        <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4" />
                        <span>
                          {loading
                            ? "Sending Code..."
                            : "Send Verification Code"}
                        </span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {showOtp && (
                <div className="mt-4 space-y-4 border-t pt-4">
                  <div className="bg-green-50 p-4 rounded-md">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5 text-green-600 mr-2" />
                      <p className="text-sm text-green-800">
                        We&apos;ve sent a 6-digit verification code to{" "}
                        <strong>{user?.email}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="text-center">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Enter Verification Code
                    </label>
                    <OtpInput
                      length={6}
                      value={otpData.otp}
                      onChange={handleOtpChange}
                      onComplete={handleOtpComplete}
                      autoFocus={true}
                    />
                  </div>

                  <div className="flex justify-center mt-4">
                    {otpData.canResend ? (
                      <button
                        onClick={resendOtp}
                        disabled={loading}
                        className="text-primary-orange hover:text-primary-orange/90 font-medium text-sm"
                      >
                        Resend Code
                      </button>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Resend code in {otpData.countdown}s
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={cancelPasswordChange}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={verifyOtpAndChangePassword}
                      disabled={
                        otpData.isVerifying || otpData.otp.join("").length !== 6
                      }
                      className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-500/90 disabled:opacity-50 text-sm"
                    >
                      {otpData.isVerifying
                        ? "Verifying..."
                        : "Verify & Update Password"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
