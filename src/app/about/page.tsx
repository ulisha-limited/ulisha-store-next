/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */ 

import {
  ShoppingBag,
  Truck,
  Shield,
  CreditCard,
  Users,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { Metadata } from "next";

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
    url: "https://ulishastore.com/about",
    siteName: "Ulisha Store",
    images: [
      {
        url: "https://ulishastore.com/favicon.png",
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
    images: ["https://ulishastore.com/favicon.png"],
    creator: "@ulishastore",
  },
};

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12 relative animate-fade-in">
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
            <span className="w-40 h-40 bg-orange-100 rounded-full blur-2xl opacity-60 animate-pulse"></span>
          </div>
          <h1 className="text-5xl font-extrabold text-orange-500 mb-4 drop-shadow-lg tracking-tight relative z-10 animate-slide-down">
            Ulisha Store
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-4 relative z-10 animate-fade-in">
            Your vibrant hub for fashion, accessories, and electronics, where
            innovation meets style.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-4 relative z-10">
            <span className="inline-flex items-center bg-orange-50 text-orange-700 px-4 py-2 rounded-full font-medium shadow hover:scale-105 transition-transform duration-200">
              Registered as{" "}
              <span className="font-bold ml-1">#8644622 Ulisha Limited</span>
            </span>
            <span className="inline-flex items-center bg-orange-50 text-orange-700 px-4 py-2 rounded-full font-medium shadow hover:scale-105 transition-transform duration-200">
              Proudly Nigerian 🇳🇬
            </span>
          </div>
          <p className="text-base text-gray-600 max-w-3xl mx-auto relative z-10 animate-fade-in">
            We’re committed to delivering top-quality products at competitive
            prices, blending convenience with choice. Shop confidently with
            multiple payment options—including both fiat and
            cryptocurrency—backed by secure transactions and a customer-first
            approach.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="bg-gradient-to-r from-orange-50 to-white rounded-xl shadow-lg p-10 mb-12 grid md:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col items-center text-center md:items-start md:text-left group">
            <div className="bg-orange-500/10 rounded-full p-4 mb-4 transition-transform group-hover:scale-110">
              <Shield className="h-8 w-8 text-orange-500 animate-bounce" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">
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
            <div className="bg-orange-500/10 rounded-full p-4 mb-4 transition-transform group-hover:scale-110">
              <ShoppingBag className="h-8 w-8 text-orange-500 animate-bounce" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">
              Our Vision
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              To become Nigeria&apos;s most trusted e-commerce platform, known
              for our quality products, reliable service, and innovative payment
              solutions. We aim to revolutionize the online shopping experience
              in Africa.
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: <Shield className="h-8 w-8" />,
              title: "Secure Shopping",
              desc: "Your security is our priority. We use industry-standard encryption to protect your personal and payment information.",
            },
            {
              icon: <CreditCard className="h-8 w-8" />,
              title: "Multiple Payment Options",
              desc: "Choose from various payment methods including credit cards, bank transfers, and cryptocurrencies.",
            },
            {
              icon: <Truck className="h-8 w-8" />,
              title: "Fast Delivery",
              desc: "We partner with reliable logistics companies to ensure your orders reach you quickly and safely.",
            },
          ].map((feature, idx) => (
            <div
              key={feature.title}
              className="bg-white rounded-lg shadow-md p-6 group hover:shadow-xl hover:-translate-y-2 transition-all duration-200 cursor-pointer"
            >
              <div className="text-orange-500 mb-4 group-hover:animate-wiggle">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Why Choose Us */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why Choose Ulisha Store?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <ShoppingBag className="h-6 w-6 text-orange-500" />,
                title: "Quality Products",
                desc: "Carefully curated selection of high-quality items",
              },
              {
                icon: <CreditCard className="h-6 w-6 text-orange-500" />,
                title: "Secure Payments",
                desc: "Multiple secure payment options available",
              },
              {
                icon: <Users className="h-6 w-6 text-orange-500" />,
                title: "Customer Support",
                desc: "Dedicated team ready to assist you",
              },
              {
                icon: <Truck className="h-6 w-6 text-orange-500" />,
                title: "Fast Shipping",
                desc: "Quick and reliable delivery service",
              },
            ].map((item, idx) => (
              <div
                key={item.title}
                className="text-center group hover:bg-orange-50 rounded-lg p-4 transition-all duration-200 cursor-pointer"
              >
                <div className="bg-orange-500/10 rounded-full p-4 inline-block mb-4 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Contact Us
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <Phone className="h-6 w-6 text-orange-500 animate-pulse" />
                ),
                label: "Phone",
                value: "+234 (0) 706 043 8205",
                link: "tel:+2347060438205",
              },
              {
                icon: (
                  <Mail className="h-6 w-6 text-orange-500 animate-pulse" />
                ),
                label: "Email",
                value: "support@ulishastore.com",
                link: "mailto:support@ulishastore.com",
              },
              {
                icon: (
                  <MapPin className="h-6 w-6 text-orange-500 animate-pulse" />
                ),
                label: "Address",
                value: "Lagos, Nigeria",
                link: "https://goo.gl/maps/xyz", // Replace with actual map link if available
              },
            ].map((contact) => (
              <a
                key={contact.label}
                href={contact.link}
                className="flex items-center space-x-4 hover:bg-orange-50 rounded-lg p-4 transition-all duration-200 group"
                target={contact.label === "Address" ? "_blank" : undefined}
                rel={
                  contact.label === "Address"
                    ? "noopener noreferrer"
                    : undefined
                }
              >
                {contact.icon}
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {contact.label}
                  </h3>
                  <p className="text-gray-600 group-hover:text-orange-600 transition-colors">
                    {contact.value}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
