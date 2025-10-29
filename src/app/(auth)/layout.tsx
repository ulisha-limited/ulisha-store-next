/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

import Recaptcha from "@/components/Recaptcha";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isProd = process.env.NODE_ENV === "production";

  if (isProd)
    return (
      <Recaptcha>
        <div className="min-h-screen bg-white">{children}</div>
      </Recaptcha>
    );

  return <div className="min-h-screen bg-white">{children}</div>;
}
