/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
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
