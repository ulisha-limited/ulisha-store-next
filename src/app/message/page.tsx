"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function Chat() {
  const [messages, setMessages] = useState<
    Array<{
      id: string;
      text: string;
      sender: "user" | "support";
      timestamp: Date;
    }>
  >([
    {
      id: "1",
      text: "Hello! Welcome to Ulisha Store support. How can I help you today?",
      sender: "support",
      timestamp: new Date(),
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user" as const,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");

    // Simulate support response after a delay
    setTimeout(() => {
      const supportResponses = [
        "Thank you for your message. Our team will get back to you shortly.",
        "I understand your concern. Let me check that for you.",
        "We appreciate your patience. Is there anything else I can help you with?",
        "I'll make sure this is addressed right away.",
        "Thank you for shopping with Ulisha Store. We value your feedback.",
      ];

      const randomResponse =
        supportResponses[Math.floor(Math.random() * supportResponses.length)];

      const supportMessage = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: "support" as const,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, supportMessage]);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Chat header */}
          <div className="bg-[#007BFF] text-white p-4">
            <h2 className="text-xl font-semibold">Chat Support</h2>
            <p className="text-sm opacity-80">
              We typically reply within a few minutes
            </p>
          </div>

          {/* Chat messages */}
          <div className="h-[500px] overflow-y-auto p-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-[#007BFF] text-white rounded-tr-none"
                      : "bg-white border rounded-tl-none"
                  }`}
                >
                  <div className="flex items-center mb-1">
                    {message.sender === "support" ? (
                      <span className="text-xs font-medium text-gray-500">
                        Support Agent
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-gray-100">
                        You
                      </span>
                    )}
                    <span
                      className={`text-xs ml-2 ${
                        message.sender === "user"
                          ? "text-gray-200"
                          : "text-gray-400"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <p
                    className={
                      message.sender === "user" ? "text-white" : "text-gray-800"
                    }
                  >
                    {message.text}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat input */}
          <div className="border-t p-4">
            <form onSubmit={handleSendMessage} className="flex items-center">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
              />
              <button
                type="submit"
                className="bg-[#007BFF] text-white px-4 py-2 rounded-r-lg hover:bg-[#0066CC] transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Contact information */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Other Ways to Contact Us
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Email</p>
              <p className="text-gray-600">support@ulishastore.com</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Phone</p>
              <p className="text-gray-600">+234 (0) 123 456 7890</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Business Hours
              </p>
              <p className="text-gray-600">Monday - Friday: 9am - 5pm WAT</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
