/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

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
      name: "Elisha Okai",
      role: "CEO",
      description:
        "Elisha is the visionary behind Ulisha Store, dedicated to transforming online shopping in Nigeria.",
      image: "https://avatars.githubusercontent.com/elitexv",
      url: "https://elishasfolio.vercel.app",
    },
    {
      name: "Melvin Jones Repol",
      role: "CTO",
      description:
        "Melvin leads the technology team, ensuring a seamless and secure shopping experience for all customers.",
      image: "https://avatars.githubusercontent.com/mrepol742",
      url: "https://www.melvinjonesrepol.com",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
            <span className="w-40 h-40 bg-orange-100 rounded-full blur-2xl opacity-60 animate-pulse"></span>
          </div>
          <h1 className="text-4xl font-extrabold text-orange-500 mb-4">
            Shop with ease, Quality Products, Effortless Shopping.
          </h1>
          <p className="text-lg text-gray-700 w-100 mx-auto">
            We are committed to providing you with a seamless online shopping
            experience.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold text-orange-500 mb-1">120+</h2>
            <span className="text-gray-700 font-medium">Products</span>
          </div>
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold text-orange-500 mb-1">20+</h2>
            <span className="text-gray-700 font-medium">Happy Customers</span>
          </div>
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold text-orange-500 mb-1">5+</h2>
            <span className="text-gray-700 font-medium">Product Sales</span>
          </div>
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold text-orange-500 mb-1">10+</h2>
            <span className="text-gray-700 font-medium">Brands</span>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="bg-gradient-to-r from-orange-50 to-white rounded-xl shadow-lg p-10 mb-12 grid md:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col items-center text-center md:items-start md:text-left group">
            <h2 className="text-2xl font-extrabold text-orange-500">
              Our Mission
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              To provide our customers with high-quality, affordable products
              while ensuring a seamless shopping experience. We strive to make
              online shopping accessible to everyone by offering multiple
              payment options and excellent customer service.
            </p>
          </div>
          <div className="flex flex-col items-center text-center md:items-start md:text-left group">
            <h2 className="text-2xl font-extrabold text-orange-500">
              Our Vision
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              To become Nigeria&apos;s most trusted e-commerce platform, known
              for our quality products, reliable service, and innovative payment
              solutions. We aim to revolutionize the online shopping experience
              in Africa.
            </p>
          </div>
          <p className="text-sm text-gray-500">
            Ulisha Store is a brand owned and operated by{" "}
            <Link href="">
              <strong>Ulisha Limited</strong>
            </Link>
            .
          </p>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-orange-500">
            Our Leadership
          </h2>
          <p className="text-gray-700 text-lg w-100 mx-auto mb-6">
            Meet the team behind Ulisha Store, dedicated to bringing you the
            best online shopping experience.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {leaders.map((leader, index) => (
              <Link
                href={leader.url}
                key={index}
                target="_blank"
                className="bg-gradient-to-r from-orange-50 to-white rounded-xl flex flex-col items-center p-4 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <Image
                  src={leader.image}
                  alt={leader.name}
                  className="w-24 h-24 rounded-full mb-2"
                  width="96"
                  height="96"
                />
                <h3 className="text-xl font-semibold text-orange-500">
                  {leader.name}
                </h3>
                <p className="text-gray-700">{leader.role}</p>
                <p className="text-gray-600 text-sm mt-2">
                  {leader.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
