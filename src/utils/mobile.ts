/**
 * Copyright (c) 2025 Ulisha Limited
 *
 * This file is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * You may obtain a copy of the License at:
 *
 *     https://creativecommons.org/licenses/by-nc/4.0/
 *
 */

export const isMobile = () => {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || "";
  return ua.includes("UlishaStore/1.0.0");
};
