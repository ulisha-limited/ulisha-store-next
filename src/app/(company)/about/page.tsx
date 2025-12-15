/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */


import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
// --- REMOVED: import { ArrowRight } from "lucide-react";

// --- ADDED Font Awesome Imports ---
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";


export const metadata: Metadata = {
  title: "About Us - Ulisha Store",
  description:
    "Learn more about Ulisha Store, our mission, vision, and commitment to delivering quality products and exceptional service in Nigeria.",
  keywords: [
    "Ulisha Store",
    "About Us",
    "E-commerce Nigeria",
    "Online Shopping",
    "Quality Products",
    "Customer Service",
    "Mission",
    "Vision",
    "Trusted Store",
  ],
  openGraph: {
    title: "About Us - Ulisha Store",
    description:
      "Learn more about Ulisha Store, our mission, vision, and commitment to delivering quality products and exceptional service in Nigeria.",
    url: "https://www.ulishastore.com/about",
    siteName: "Ulisha Store",
    images: [
      {
        url: "https://www.ulishastore.com/favicon.png",
        width: 1200,
        height: 630,
        alt: "Ulisha Store Icon",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us - Ulisha Store",
    description:
      "Learn more about Ulisha Store, our mission, vision, and commitment to delivering quality products and exceptional service in Nigeria.",
    images: ["https://www.ulishastore.com/favicon.png"],
    creator: "@ulishastore",
  },
};

export default function About() {
  const leaders = [
    {
      name: "Elisha Paul Okai",
      role: "President & CEO",
      image: "/images/elitexv.png",
      url: "https://elishasfolio.vercel.app",
    },
    {
      name: "Melvin Jones Repol",
      role: "Chief Technology Officer",
      image: "/images/mrepol742.png",
      url: "https://www.melvinjonesrepol.com",
    },
  ];

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-24 sm:py-32 flex flex-col justify-center items-center text-center relative">
          <Image
            src="/ulisha-store-icon-192.png"
            width="100"
            height="100"
            alt="Ulisha Store Icon"
            className="mb-8"
          />
          <h1 className="text-6xl text-blue-500 font-extrabold mb-6">
            Ulisha Store
          </h1>
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none -z-10">
            <span className="w-40 h-40 bg-orange-100 rounded-full blur-2xl opacity-60 animate-pulse"></span>
          </div>
          <h2 className="text-4xl text-gray-800 mb-4">
            Shop with ease, Quality Products, Effortless Shopping.
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-16">
            We are committed to providing you with a seamless online shopping
            experience.
          </p>

          <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <h2 className="text-3xl font-bold text-orange-500 mb-1">120+</h2>
              <span className="text-gray-700 font-medium">Products</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-orange-500 mb-1">20+</h2>
              <span className="text-gray-700 font-medium">Happy Customers</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-orange-500 mb-1">5+</h2>
              <span className="text-gray-700 font-medium">Product Sales</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-orange-500 mb-1">10+</h2>
              <span className="text-gray-700 font-medium">Brands</span>
            </div>
          </div>
        </div>

        <div className="py-24">
          <div className="bg-gradient-to-r from-orange-50 to-white rounded-xl shadow-lg p-10 sm:p-16 grid md:grid-cols-2 gap-10 items-center">
            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              <h2 className="text-3xl font-extrabold text-orange-500 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                To provide our customers with high-quality, affordable products
                while ensuring a seamless shopping experience. We strive to make
                online shopping accessible to everyone by offering multiple
                payment options and excellent customer service.
              </p>
            </div>
            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              <h2 className="text-3xl font-extrabold text-orange-500 mb-4">
                Our Vision
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                To become Nigeria&apos;s most trusted e-commerce platform, known
                for our quality products, reliable service, and innovative payment
                solutions. We aim to revolutionize the online shopping experience
                in Africa.
              </p>
            </div>
            <span className="md:col-span-2 text-center text-gray-500 italic mt-8">
              Ulisha Store is a brand owned and operated by Ulisha Limited.
            </span>
          </div>
        </div>

        <div className="py-24 grid md:grid-cols-2 gap-12 items-center">
          <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
            <Image
              src="/images/teamimg.png"
              alt="Ulisha Store Team"
              width={600}
              height={400}
              className="rounded-lg object-cover w-full h-80"
            />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-orange-500 mb-4">
              Our Story
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Founded in 2025, Ulisha Store started with a simple idea: to make
              world-class products accessible to every Nigerian. We saw the
              challenges of a fragmented market and were inspired to build a
              platform built on trust, quality, and exceptional customer service.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              From our humble beginnings, we have grown into a dedicated team
              passionate about e-commerce and technology, constantly innovating
              to serve you better.
            </p>
          </div>
        </div>

        <div className="py-24 bg-white rounded-xl shadow-inner">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl font-extrabold text-orange-500">
              Our Leadership
            </h2>
            <p className="text-gray-700 text-lg max-w-2xl mx-auto mt-4 mb-12">
              Meet the team behind Ulisha Store, dedicated to bringing you the
              best online shopping experience.
            </p>
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto px-4">
            {leaders.map((leader, index) => (
              <Link
                href={leader.url}
                key={index}
                prefetch={false}
                target="_blank"
                className="bg-gradient-to-r from-orange-50 to-white rounded-xl flex flex-col items-center p-6 shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1"
              >
                <Image
                  src={leader.image}
                  alt={leader.name}
                  className="w-40 h-40 rounded-full mb-4 object-cover"
                  width="160"
                  height="160"
                />
                <h3 className="text-2xl font-semibold text-orange-500">
                  {leader.name}
                </h3>
                <p className="text-gray-700">{leader.role}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="py-24 text-center">
          <h2 className="text-3xl font-extrabold text-orange-500 mb-4">
            Transparency & Trust
          </h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto mb-8">
            We believe in complete transparency. Our commitment to you
            is built on trust, which is why our governance documents are
            available for you to review.
          </p>
          <Link
            href="/files/certificates/CERTIFICATE - ULISHA LIMITED.pdf"
            className="inline-flex items-center gap-2 text-white bg-orange-500 font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-orange-600 transition-colors duration-300"
          >
            View Articles of Incorporation
            {/* --- REPLACED Lucide ArrowRight with Font Awesome --- */}
            <FontAwesomeIcon icon={faArrowRight} className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}