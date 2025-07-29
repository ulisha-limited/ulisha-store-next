import React, { useState, useEffect } from "react";
import type { Product } from "@/store/cartStore";
import {
  Star,
  ShoppingCart,
  Phone,
  Share2,
  Copy,
  Check,
  MapPin,
  Plane,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useCurrencyStore } from "@/store/currencyStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";

export function ProductCard({ product }: { product: Product }) {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const addToCart = useCartStore((state) => state.addToCart);
  const isLoggedIn = useAuthStore((state) => !!state.user);
  const { formatPrice, currency } = useCurrencyStore();
  const router = useRouter();
  const navigate = router.push;

  const formattedPrice = formatPrice(product.price);
  const formattedOriginalPrice = product.original_price
    ? formatPrice(product.original_price)
    : null;

  // Listen for currency changes
  useEffect(() => {
    const handleCurrencyChange = () => {
      // Force re-render by updating a state
      setLinkCopied(false);
    };

    window.addEventListener("currencyChange", handleCurrencyChange);
    return () =>
      window.removeEventListener("currencyChange", handleCurrencyChange);
  }, []);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      await addToCart(product);
      toast.success("Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(
        "Failed to add product to cart. Please try again."
      );
    }
  };

  const handleCallSeller = () => {
    if (product.seller_phone) {
      window.location.href = `tel:${product.seller_phone}`;
    }
  };

  const getProductLink = () => {
    return `https://ulishastore.com/product/${product.id}`;
  };

  const copyToClipboard = () => {
    const link = getProductLink();
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setLinkCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setLinkCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
        toast.error("Failed to copy link. Please try again.");
      });
  };

  const shareToSocial = (platform: "facebook" | "twitter" | "whatsapp") => {
    const link = getProductLink();
    const text = `Check out this product: ${product.name}`;
    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          link
        )}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}&url=${encodeURIComponent(link)}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(
          `${text} ${link}`
        )}`;
        break;
    }

    window.open(shareUrl, "_blank");
    setShowShareOptions(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 group overflow-hidden">
      <div className="relative pb-[100%] overflow-hidden rounded-t-lg">
        <Image
          src={product.image}
          alt={product.name}
          className="absolute top-0 left-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200 cursor-pointer"
          onClick={() => navigate(`/product/${product.id}`)}
          width={500}
          height={500}
        />

        {/* Discount badge */}
        {product.discount_active && (product.discount_percentage ?? 0) > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            -{product.discount_percentage}%
          </div>
        )}

        {/* Shipped from abroad badge */}
        {product.shipping_location === "Abroad" && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-medium flex items-center">
            <Plane className="w-2 h-2 sm:w-2.5 sm:h-2.5 mr-0.5" />
            <span className="hidden xs:inline">Shipped from abroad</span>
            <span className="xs:hidden">From Abroad</span>
          </div>
        )}

        {/* Share button */}
        <button
          onClick={() => setShowShareOptions(!showShareOptions)}
          className="absolute bottom-2 right-2 bg-white bg-opacity-80 p-2 rounded-full hover:bg-opacity-100 transition-all z-10"
        >
          <Share2 className="w-4 h-4 text-gray-700" />
        </button>

        {/* Share options dropdown */}
        {showShareOptions && (
          <div className="absolute bottom-12 right-2 bg-white rounded-lg shadow-lg p-2 z-20">
            <div className="flex flex-col space-y-1">
              <button
                onClick={() => shareToSocial("facebook")}
                className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded-md text-sm whitespace-nowrap"
              >
                <div className="w-5 h-5 bg-blue-600 text-white flex items-center justify-center rounded-full">
                  f
                </div>
                <span>Facebook</span>
              </button>
              <button
                onClick={() => shareToSocial("twitter")}
                className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded-md text-sm whitespace-nowrap"
              >
                <div className="w-5 h-5 bg-blue-400 text-white flex items-center justify-center rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </div>
                <span>Twitter</span>
              </button>
              <button
                onClick={() => shareToSocial("whatsapp")}
                className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded-md text-sm whitespace-nowrap"
              >
                <div className="w-5 h-5 bg-green-500 text-white flex items-center justify-center rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path>
                  </svg>
                </div>
                <span>WhatsApp</span>
              </button>
              <button
                onClick={copyToClipboard}
                className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded-md text-sm whitespace-nowrap"
              >
                {linkCopied ? (
                  <>
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5 text-gray-500" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="mb-1">
          <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
            {product.category}
          </span>
        </div>
        <h3
          className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 min-h-[2.5rem] cursor-pointer hover:text-[#FF6600]"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          {product.name}
        </h3>
        <div className="flex items-center mb-2">
          <div className="flex items-center text-orange-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  (product.rating || 5) > i ? "fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-baseline space-x-2">
            <div className="text-base font-bold text-gray-900">
              {formattedPrice}
            </div>
            {product.discount_active && formattedOriginalPrice && (
              <div className="text-xs text-gray-500 line-through">
                {formattedOriginalPrice}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
