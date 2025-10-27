/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */


import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions - Ulisha Store",
  description: "Find answers to common questions about our services.",
  keywords: [
    "FAQ",
    "Frequently Asked Questions",
    "Help",
    "Support",
    "Questions",
    "Answers",
  ],
  alternates: {
    canonical: "https://www.ulishastore.com/faq",
  },
  openGraph: {
    title: "Frequently Asked Questions - Ulisha Store",
    description: "Find answers to common questions about our services.",
    url: "https://www.ulishastore.com/faq",
    siteName: "Ulisha Store",
    images: [
      {
        url: "/favicon.png",
        width: 800,
        height: 600,
        alt: "Frequently Asked Questions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions - Ulisha Store",
    description: "Find answers to common questions about our services.",
    images: ["/favicon.png"],
    creator: "@ulishastore",
  },
};

export default function FAQPage() {
  const frequentQuestions = [
    {
      question: "What is Ulisha Store?",
      answer:
        "Ulisha Store is an online platform offering a variety of digital products and services, including software, games, and more.",
    },
    {
      question: "How can I contact support?",
      answer:
        "You can contact our support team via the contact form on our website or by emailing us at support@ulishastore.com",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept various payment methods including credit cards, PayPal, crypocurrencies and bank transfers. Please check our payment page for more details.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "Yes, we offer refunds within 7 days of purchase for eligible products. Please refer to our refund policy for more information.",
    },
    {
      question: "How to track my order?",
      answer:
        "You can track your order status through the order tracking page on our website. You will also receive an email with tracking information once your order has shipped.",
    },
    {
      question: "How to file for a refund if the product did not arrive?",
      answer:
        "If your product did not arrive, please contact our support team with your order details. We will assist you in processing a refund or resending the product.",
    },
    {
      question: "How to report a bug or issue with a product?",
      answer:
        "If you encounter a bug or issue with a product, please report it through our support page or contact us via email. Provide as much detail as possible to help us resolve the issue quickly.",
    },
    {
      question: "How to change my account password?",
      answer:
        "To change your account password, go to your account settings and select 'Change Password'. Follow the prompts to update your password securely.",
    },
    {
      question: "How to delete my account?",
      answer:
        "To delete your account, please contact our support team. We will guide you through the process and ensure your account is removed securely.",
    },
    {
      question: "The product did not move after payment, what should I do?",
      answer:
        "If your product did not move location after payment, please check your email for any instructions or confirmation. If you still have issues, contact our support team with your order details, and we will assist you in resolving the problem.",
    },
    {
      question: "Do you accept COD (Cash on Delivery)?",
      answer:
        "Currently, we do not accept Cash on Delivery (COD) as a payment method. We recommend using secure online payment methods for your purchases.",
    },
    {
      question: "How secure is my personal information?",
      answer:
        "We take your privacy seriously and implement strict security measures to protect your personal information. All transactions are encrypted, and we do not share your data with third parties without your consent.",
    },
    {
      question:
        "The product arrived damaged or not as described, what should I do?",
      answer:
        "If your product arrived damaged or not as described, please contact our support team within 7 days of receiving the product. Provide your order details and any relevant photos, and we will assist you in resolving the issue, which may include a refund or replacement.",
    },
    {
      question: "My address is not on the list, how can I add it?",
      answer:
        "If your address is not listed during checkout, please contact our support team. We can assist you in adding your address to our system so you can complete your purchase.",
    },
    {
      question: "Delivery took too long, what should I do?",
      answer:
        "If your delivery is taking longer than expected, please check the tracking information provided in your order confirmation email. If you still have concerns, contact our support team with your order details, and we will investigate the delay and provide you with an update.",
    },
    {
      question: "Payment provider charge me extra fees, what should I do?",
      answer:
        "If your payment provider charged you extra fees, please contact them directly as we do not control their fees. However, if you believe there was an error in the transaction, please reach out to our support team with your order details, and we will assist you in resolving the issue.",
    },
    {
      question: "Can I change my order after it has been placed?",
      answer:
        "Once an order is placed, changes may not be possible. However, you can contact our support team as soon as possible, and we will do our best to accommodate your request if the order has not yet been processed.",
    },
    {
      question: "Can i cancel my order?",
      answer: "Yes, you can cancel your order within 24 hours of placing it.",
    },
    {
      question: "Can I get a discount on my next purchase?",
      answer:
        "Yes, we often have promotions and discounts. Subscribe to our newsletter or follow us on social media to stay updated on the latest offers.",
    },
    {
      question: "What is Affiliate Program?",
      answer:
        "Our Affiliate Program allows you to earn commissions by promoting our products. You can sign up on our website to become an affiliate and start earning by sharing your unique referral link.",
    },
    {
      question: "How to become an affiliate?",
      answer:
        "To become an affiliate, visit our Affiliate Program page and fill out the application form. Once approved, you will receive a unique referral link to share with your audience.",
    },
    {
      question: "How to track my affiliate earnings?",
      answer:
        "You can track your affiliate earnings through your affiliate dashboard on our website. It provides real-time updates on clicks, conversions, and commissions earned.",
    },
    {
      question: "What are the commission rates for affiliates?",
      answer:
        "Commission rates vary based on the products you promote. Please refer to our Affiliate Program page for detailed information on commission structures.",
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-center mb-8">
          <FontAwesomeIcon
            icon={faQuestion}
            className="text-4xl text-orange-500 mb-2"
          />
          <h1 className="text-3xl font-bold mb-2 text-gray-700">
            Frequently Asked Questions
          </h1>
          <p className="mb-4 text-gray-700">
            Here are some common questions and answers about our services.
          </p>
        </div>

        <div className="space-y-6 mb-9">
          {frequentQuestions.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {item.question}
              </h2>
              <p className="text-gray-600">{item.answer}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
