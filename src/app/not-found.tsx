/**
 * Copyright (c) 2025 Ulisha Limited
 *
 * This file is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * You may obtain a copy of the License at:
 *
 *     https://creativecommons.org/licenses/by-nc/4.0/
 *
 */


import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <section className="flex flex-col md:flex-row min-h-screen items-center justify-center bg-gray-100 px-6 py-10">

        <div className="flex-shrink-0">
          <Image
            src="/images/not-found.png"
            alt="Not Found"
            width={500}
            height={500}
            className="mx-auto md:mx-0"
          />
        </div>

        <div className="mt-8 md:mt-0 md:ml-10 text-center md:text-left text-gray-800">
          <h1 className="text-9xl font-bold text-blue-600">404</h1>
          <p className="mt-4 text-lg text-gray-600">
            We&apos;re sorry, but the page you&apos;re looking for isn&apos;t
            available.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            If you believe this is an error, please contact our support team.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
          >
            Go Back Home
          </Link>
        </div>
      </section>
    </main>
  );
}
