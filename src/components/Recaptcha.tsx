/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */


import { ReCaptchaProvider } from "next-recaptcha-v3";

export default function Recaptcha({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
    >
      {children}
    </ReCaptchaProvider>
  );
}
