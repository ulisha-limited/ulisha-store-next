/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */ 

import { useEffect } from "react";
import zxcvbn from "zxcvbn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";


interface PasswordStrengthMeterProps {
  password: string;
  onStrengthChange?: (strength: number) => void;
}

export function PasswordStrengthMeter({
  password,
  onStrengthChange,
}: PasswordStrengthMeterProps) {
  const result = zxcvbn(password);
  const score = result.score; // 0-4 (0 = weak, 4 = strong)

  useEffect(() => {
    if (onStrengthChange) {
      onStrengthChange(score);
    }
  }, [score, onStrengthChange]);

  const getStrengthText = () => {
    switch (score) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default:
        return "";
    }
  };

  const getStrengthColor = () => {
    switch (score) {
      case 0:
        return "bg-red-500";
      case 1:
        return "bg-orange-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-green-400";
      case 4:
        return "bg-green-500";
      default:
        return "bg-gray-200";
    }
  };

  return (
    <div className="mt-2">
      <div className="flex items-center space-x-2 mb-1">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${(score + 1) * 20}%` }}
          />
        </div>
        <span className="text-xs text-gray-500">{getStrengthText()}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center text-xs text-gray-500">
          <FontAwesomeIcon
            icon={faCheck}
            className={`h-3 w-3 mr-1 ${
              password.length >= 8 ? "text-green-500" : "text-gray-300"
            }`}
          />
          <span>8+ characters</span>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <FontAwesomeIcon
            icon={faCheck}
            className={`h-3 w-3 mr-1 ${
              /[A-Z]/.test(password) ? "text-green-500" : "text-gray-300"
            }`}
          />
          <span>Uppercase</span>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <FontAwesomeIcon
            icon={faCheck}
            className={`h-3 w-3 mr-1 ${
              /[a-z]/.test(password) ? "text-green-500" : "text-gray-300"
            }`}
          />
          <span>Lowercase</span>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <FontAwesomeIcon
            icon={faCheck}
            className={`h-3 w-3 mr-1 ${
              /[0-9]/.test(password) ? "text-green-500" : "text-gray-300"
            }`}
          />
          <span>Number</span>
        </div>
      </div>
      {result.feedback.warning && (
        <p className="mt-1 text-xs text-red-500">{result.feedback.warning}</p>
      )}
    </div>
  );
}
