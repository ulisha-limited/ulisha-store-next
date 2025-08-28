"use client";

import React, { useState } from 'react';
import { Mail, User, Globe, MessageSquare, CheckCircle, DollarSign, Award } from 'lucide-react';

const App = () => {
  // Use state to manage form input data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    message: ''
  });
  const [submissionStatus, setSubmissionStatus] = useState<null | 'submitting' | 'success' | 'error'>(null); // 'submitting', 'success', or 'error'

  // Mock form submission handler
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmissionStatus('submitting');
    console.log("Submitting form data:", formData);

    // Simulate an API call
    setTimeout(() => {
      // In a real application, you would send the data to your backend here
      // and update the status based on the API response.
      const success = Math.random() > 0.1; // Simulate a 90% success rate
      if (success) {
        setSubmissionStatus('success');
        setFormData({ name: '', email: '', website: '', message: '' }); // Clear form
      } else {
        setSubmissionStatus('error');
      }
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Benefits for the affiliate program
  const benefits = [
    { text: "Earn up to 15% commission on every sale.", icon: DollarSign },
    { text: "Get access to marketing materials and dedicated support.", icon: Award },
    { text: "Track your clicks, conversions, and earnings in real-time.", icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 p-4 sm:p-6 lg:p-8 flex items-center justify-center">

      <main className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Left Column: Benefits Section, now with the orange gradient */}
        <div className="relative p-8 sm:p-12 bg-gradient-to-br from-orange-400 to-orange-600 text-white flex flex-col justify-center">
          {/* Removed the conflicting background image style here */}
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Partner with Ulisha & Earn Rewards
            </h2>
            <p className="text-sm sm:text-base mb-8 opacity-90">
              Join our growing community of content creators and influencers. It&apos;s simple to get started and a great way to monetize your platform.
            </p>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <benefit.icon size={20} className="flex-shrink-0" />
                  <span className="font-medium">{benefit.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Application Form */}
        <div className="w-full bg-white p-6 sm:p-8">
          <header className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Apply Now</h1>
            <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto">
              Fill out the form below to get started on your application.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name Input */}
              <div className="relative">
                <label htmlFor="name" className="sr-only">Full Name</label>
                <div className="flex items-center rounded-lg border border-slate-300 bg-slate-100/80 focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500 transition-all duration-200">
                  <div className="p-3 text-slate-400">
                    <User size={20} />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    required
                    className="w-full bg-transparent p-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="relative">
                <label htmlFor="email" className="sr-only">Email Address</label>
                <div className="flex items-center rounded-lg border border-slate-300 bg-slate-100/80 focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500 transition-all duration-200">
                  <div className="p-3 text-slate-400">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    required
                    className="w-full bg-transparent p-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Website/Social Media Input */}
            <div className="relative">
              <label htmlFor="website" className="sr-only">Website / Social Media Link</label>
              <div className="flex items-center rounded-lg border border-slate-300 bg-slate-100/80 focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500 transition-all duration-200">
                <div className="p-3 text-slate-400">
                  <Globe size={20} />
                </div>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="Website or Social Media Link"
                  required
                  className="w-full bg-transparent p-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Message Textarea */}
            <div className="relative">
              <label htmlFor="message" className="sr-only">Tell us about yourself</label>
              <div className="flex items-start rounded-lg border border-slate-300 bg-slate-100/80 focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500 transition-all duration-200">
                <div className="p-3 text-slate-400">
                  <MessageSquare size={20} />
                </div>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us why you would be a great affiliate..."
                  rows={5}
                  required
                  className="w-full bg-transparent p-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
                ></textarea>
              </div>
            </div>

            {/* Submission Button & Status */}
            <div>
              <button
                type="submit"
                disabled={submissionStatus === 'submitting'}
                className="w-full bg-orange-500 text-white font-semibold py-4 rounded-xl shadow-lg hover:bg-orange-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-400 disabled:cursor-not-allowed"
              >
                {submissionStatus === 'submitting' ? 'Submitting...' : 'Apply Now'}
              </button>
              {submissionStatus === 'success' && (
                <p className="mt-4 text-center text-green-600 font-medium">
                  Thank you for your application! We&apos;ll get back to you soon.
                </p>
              )}
              {submissionStatus === 'error' && (
                <p className="mt-4 text-center text-red-600 font-medium">
                  There was an error submitting your application. Please try again.
                </p>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default App;
