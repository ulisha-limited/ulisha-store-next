import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <section className="flex min-h-screen">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <Image
            src="/favicon.png"
            alt="Logo"
            width={100}
            height={100}
            className="rounded-full mb-6"
          />
          <h1 className="text-orange-500 text-4xl font-bold mb-4">
            Page Not Found
          </h1>
          <p className="text-black mb-6">
            Sorry, the page you&apos;re looking for does not exist.
          </p>
          <Link href="/">
            <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition">
              Go back home
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
