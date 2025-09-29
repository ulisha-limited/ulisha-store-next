/**
 * Copyright (c) 2025 Ulisha Limited
 *
 * This file is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * You may obtain a copy of the License at:
 *
 *     https://creativecommons.org/licenses/by-nc/4.0/
 *
 */


import { useState, useRef, useEffect } from "react";

interface OtpInputProps {
  length?: number;
  value: string[];
  onChange: (otp: string[]) => void;
  onComplete?: (otp: string) => void;
  autoFocus?: boolean;
}

export default function OtpInput({
  length = 6,
  value,
  onChange,
  onComplete,
  autoFocus = true,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Auto focus the first input on mount
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = e.target.value;

    // Only allow digits
    if (val && !/^\d+$/.test(val)) {
      return;
    }

    // Handle paste or multiple characters
    if (val.length > 1) {
      // Distribute the pasted value across inputs
      const chars = val.split("");
      const newOtp = [...value];

      for (let i = 0; i < Math.min(chars.length, length - index); i++) {
        newOtp[index + i] = chars[i];
      }

      onChange(newOtp);

      // Focus the appropriate input
      const nextIndex = Math.min(index + chars.length, length - 1);
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex].focus();
      }

      return;
    }

    // Handle single character
    const newOtp = [...value];
    newOtp[index] = val;
    onChange(newOtp);

    // Auto-focus next input
    if (val && index < length - 1) {
      if (inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    }

    // Check if OTP is complete
    if (val && index === length - 1) {
      const otpString = newOtp.join("");
      if (otpString.length === length && onComplete) {
        onComplete(otpString);
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!value[index] && index > 0) {
        // If current input is empty, focus previous input
        if (inputRefs.current[index - 1]) {
          inputRefs.current[index - 1]?.focus();
        }
      } else {
        // Clear current input
        const newOtp = [...value];
        newOtp[index] = "";
        onChange(newOtp);
      }
    }

    // Handle left arrow
    if (e.key === "ArrowLeft" && index > 0) {
      if (inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus();
      }
    }

    // Handle right arrow
    if (e.key === "ArrowRight" && index < length - 1) {
      if (inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");

    if (pastedData) {
      // Filter only digits
      const digits = pastedData.replace(/\D/g, "");

      if (digits) {
        const newOtp = [...value];
        for (let i = 0; i < Math.min(digits.length, length); i++) {
          newOtp[i] = digits[i];
        }

        onChange(newOtp);

        // Focus the appropriate input
        const focusIndex = Math.min(digits.length, length - 1);
        if (inputRefs.current[focusIndex]) {
          inputRefs.current[focusIndex].focus();
        }

        // Check if OTP is complete
        if (digits.length >= length && onComplete) {
          onComplete(newOtp.join(""));
        }
      }
    }
  };

  return (
    <div className="flex justify-center space-x-2">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={index === 0 ? handlePaste : undefined}
          className="w-10 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md shadow-sm focus:border-primary-orange focus:ring-primary-orange"
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
}
