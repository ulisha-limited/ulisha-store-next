/**
 * Copyright (c) 2025 Ulisha Limited
 *
 * This file is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * You may obtain a copy of the License at:
 *
 *     https://creativecommons.org/licenses/by-nc/4.0/
 *
 */


import { useState, useEffect, MouseEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faBagShopping,
  faStar,
  faPercent,
  faArrowRight,
  faGift,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useCurrencyStore } from "@/store/currencyStore";
import { Database } from "@/supabase-types";
import Image from "next/image";

type Product = Database["public"]["Tables"]["products"]["Row"];
interface PromoPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

export function PromoPopup({ isVisible, onClose }: PromoPopupProps) {
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSecondShow, setIsSecondShow] = useState(false);
  const router = useRouter();
  const navigate = router.push;
  const { formatPrice } = useCurrencyStore();

  useEffect(() => {
    if (isVisible) {
      checkIfSecondShow();
      fetchRandomDiscountedProduct();
    }
  }, [isVisible]);

  const checkIfSecondShow = () => {
    const popupData = localStorage.getItem("promo_popup_data");
    if (popupData) {
      try {
        const data = JSON.parse(popupData);
        setIsSecondShow(data.showCount >= 1);
      } catch (error) {
        setIsSecondShow(false);
      }
    }
  };

  const fetchRandomDiscountedProduct = async () => {
    try {
      setLoading(true);
      const { data: discountedProducts, error } = await supabase
        .from("products")
        .select("*")
        .eq("discount_active", true)
        .not("discount_percentage", "is", null)
        .gte("discount_percentage", 10)
        .limit(20)
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (discountedProducts && discountedProducts.length > 0) {
        const randomIndex = Math.floor(
          Math.random() * discountedProducts.length
        );
        setFeaturedProduct(discountedProducts[randomIndex]);
      } else {
        const { data: allProducts } = await supabase
          .from("products")
          .select("*")
          .limit(10)
          .order("created_at", { ascending: false });
        if (allProducts && allProducts.length > 0) {
          const randomIndex = Math.floor(Math.random() * allProducts.length);
          setFeaturedProduct(allProducts[randomIndex]);
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShopNow = () => {
    if (featuredProduct) {
      navigate(`/product/${featuredProduct.id}`);
      onClose();
    }
  };

  const handleRegister = () => {
    navigate("/register");
    onClose();
  };

  const handleInnerClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  if (!isVisible) return null;

  const blue = "#007bff";

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Mobile */}
      <div
        className="md:hidden bg-white rounded-2xl w-[90%] max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in"
        onClick={handleInnerClick}
      >
        <div
          className={`${
            isSecondShow
              ? ""
              : "bg-gradient-to-r from-primary-orange to-red-500"
          } p-4 text-white relative`}
          style={
            isSecondShow
              ? { background: `linear-gradient(to right, ${blue}, ${blue})` }
              : undefined
          }
        >
          <button onClick={onClose} className="absolute top-3 right-3">
            <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
          </button>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              {isSecondShow ? (
                <FontAwesomeIcon icon={faGift} className="w-6 h-6 mr-1" />
              ) : (
                <FontAwesomeIcon icon={faBagShopping} className="w-6 h-6 mr-1" />
              )}
              <span className="text-xl font-bold">UlishaStore</span>
            </div>
            <h2 className="text-lg font-bold mb-1">
              {isSecondShow
                ? "Last Chance for Sweet Deals!"
                : "Sweet Product Sales!"}
            </h2>
            <p className="text-sm opacity-90">
              {isSecondShow
                ? "Don't miss out on these exclusive discounts"
                : "Register now and enjoy exclusive discounts"}
            </p>
          </div>
        </div>
        <div className="p-4 text-center">
          {loading ? (
            <div className="py-6">
              <div className="animate-spin h-6 w-6 border-b-2 border-primary-orange rounded-full mx-auto"></div>
            </div>
          ) : featuredProduct ? (
            <>
              <div className="relative mb-4">
                <Image
                  src={featuredProduct.image}
                  alt={featuredProduct.name}
                  className="w-full h-36 object-cover rounded-lg"
                  width={500}
                  height={200}
                />
                {featuredProduct.discount_active && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center">
                    <FontAwesomeIcon icon={faPercent} className="w-3 h-3 mr-1" />
                    {featuredProduct.discount_percentage}% OFF
                  </div>
                )}
                {isSecondShow && (
                  <div
                    className="absolute top-2 right-2 text-white px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{ background: blue }}
                  >
                    LIMITED TIME
                  </div>
                )}
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                {featuredProduct.name}
              </h3>
              <div className="flex justify-center items-center text-orange-400 mb-2">
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon
                    icon={faStar}
                    key={i}
                    className={`w-4 h-4 ${
                      (featuredProduct.rating || 5) > i
                        ? "fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-xs text-gray-500 ml-1">
                  ({featuredProduct.rating || 5})
                </span>
              </div>
              <div className="text-[#FF6600] font-bold text-lg mb-3">
                {formatPrice(featuredProduct.price)}
              </div>
              {featuredProduct.original_price && (
                <div className="flex justify-center items-center text-xs text-gray-500 line-through mb-2">
                  {formatPrice(featuredProduct.original_price)}
                  <span className="text-green-600 font-semibold ml-2">
                    Save {featuredProduct.discount_percentage}%
                  </span>
                </div>
              )}
              <button
                onClick={handleShopNow}
                className={`w-full ${
                  isSecondShow ? "" : "bg-orange-500"
                } hover:opacity-90 text-white py-2 px-3 rounded-lg flex justify-center items-center space-x-2`}
                style={isSecondShow ? { background: blue } : undefined}
              >
                <FontAwesomeIcon icon={faBagShopping} className="w-4 h-4" />
                <span>{isSecondShow ? "Grab This Deal" : "Shop Now"}</span>
                <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
              </button>
              <p className="text-xs text-gray-600 mt-2 mb-2">
                {isSecondShow
                  ? "Join thousands of happy customers!"
                  : "Want to see more amazing deals?"}
              </p>
              <button
                onClick={handleRegister}
                className={`w-full text-white py-2 px-3 rounded-lg font-medium transition-all hover:scale-105`}
                style={
                  isSecondShow
                    ? {
                        background: `linear-gradient(to right, #ff5e62, ${blue})`,
                      }
                    : {
                        background:
                          "linear-gradient(to right, #3b82f6, #2563eb)",
                      }
                }
              >
                {isSecondShow
                  ? "Register & Save More!"
                  : "Register for Exclusive Discounts"}
              </button>
              <div
                className={`mt-4 p-3 rounded-lg`}
                style={{
                  background: isSecondShow ? "#e6f0fa" : "#f9fafb",
                }}
              >
                <p className="text-xs text-gray-600 text-center">
                  {isSecondShow ? (
                    <>
                      🔥 <strong>Final Offer:</strong> Up to 25% off • Free
                      shipping • VIP access
                    </>
                  ) : (
                    <>
                      🎉 <strong>Register Benefits:</strong> Up to 20% off •
                      Free shipping • Early access to sales
                    </>
                  )}
                </p>
              </div>
              {isSecondShow && (
                <div className="mt-3 text-center">
                  <p className="text-xs font-medium" style={{ color: blue }}>
                    ⏰ This offer won&apos;t appear again for another hour!
                  </p>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-600">No product available</p>
          )}
        </div>
      </div>
      {/* Desktop */}
      <div
        className="hidden md:flex w-[85%] max-w-3xl bg-white rounded-2xl overflow-hidden shadow-2xl animate-fade-in"
        onClick={handleInnerClick}
      >
        <div className="flex w-full">
          <div className="w-1/2 relative p-4">
            {featuredProduct && (
              <>
                <Image
                  src={featuredProduct.image}
                  alt={featuredProduct.name}
                  className="w-full h-52 object-cover rounded-lg"
                  width={500}
                  height={200}
                />
                {featuredProduct.discount_active && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                    <FontAwesomeIcon icon={faPercent} className="w-4 h-4 mr-1" />
                    {featuredProduct.discount_percentage}% OFF
                  </div>
                )}
                {isSecondShow && (
                  <div
                    className="absolute top-4 right-4 text-white px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: blue }}
                  >
                    LIMITED TIME
                  </div>
                )}
              </>
            )}
          </div>
          <div className="w-1/2 p-4 relative">
            <button
              onClick={onClose}
              className="text-black absolute top-3 right-3"
            >
              <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
            </button>
            <div className="text-left">
              <h2 className="text-lg font-bold mb-1 text-orange-500">
                {isSecondShow
                  ? "Last Chance for Sweet Deals!"
                  : "Sweet Product Sales!"}
              </h2>
              <p className="text-sm text-gray-600 mb-2">
                {isSecondShow
                  ? "Don't miss out on these exclusive discounts"
                  : "Register now and enjoy exclusive discounts"}
              </p>
              {featuredProduct && (
                <>
                  <h3 className="text-black font-semibold mb-1 line-clamp-2">
                    {featuredProduct.name}
                  </h3>
                  <div className="flex text-orange-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FontAwesomeIcon
                        icon={faStar}
                        key={i}
                        className={`w-4 h-4 ${
                          (featuredProduct.rating || 5) > i
                            ? "fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">
                      ({featuredProduct.rating || 5})
                    </span>
                  </div>
                  <div className="text-[#FF6600] font-bold text-xl mb-2">
                    {formatPrice(featuredProduct.price)}
                  </div>
                  {featuredProduct.original_price && (
                    <div className="text-sm text-gray-500 line-through mb-2">
                      {formatPrice(featuredProduct.original_price)}
                      <span className="text-green-600 font-medium ml-2">
                        Save {featuredProduct.discount_percentage}%
                      </span>
                    </div>
                  )}
                  <button
                    onClick={handleShopNow}
                    className={`w-full ${
                      isSecondShow ? "" : "bg-orange-500"
                    } hover:opacity-90 text-white py-2 px-4 rounded-lg flex justify-center items-center space-x-2`}
                    style={isSecondShow ? { background: blue } : undefined}
                  >
                    <FontAwesomeIcon icon={faBagShopping} className="w-4 h-4" />
                    <span>{isSecondShow ? "Grab This Deal" : "Shop Now"}</span>
                    <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
                  </button>
                  <p className="text-xs text-gray-600 mt-2 mb-2">
                    {isSecondShow
                      ? "Join thousands of happy customers!"
                      : "Want to see more amazing deals?"}
                  </p>
                  <button
                    onClick={handleRegister}
                    className={`w-full text-white py-2 px-4 rounded-lg font-medium transition-all hover:scale-105`}
                    style={
                      isSecondShow
                        ? {
                            background: `linear-gradient(to right, #ff5e62, ${blue})`,
                          }
                        : {
                            background:
                              "linear-gradient(to right, #3b82f6, #2563eb)",
                          }
                    }
                  >
                    {isSecondShow
                      ? "Register & Save More!"
                      : "Register for Exclusive Discounts"}
                  </button>
                  <div
                    className={`mt-4 p-3 rounded-lg`}
                    style={{
                      background: isSecondShow ? "#e6f0fa" : "#f9fafb",
                    }}
                  >
                    <p className="text-xs text-gray-600 text-center">
                      {isSecondShow ? (
                        <>
                          🔥 <strong>Final Offer:</strong> Up to 25% off • Free
                          shipping • VIP access
                        </>
                      ) : (
                        <>
                          🎉 <strong>Register Benefits:</strong> Up to 20% off •
                          Free shipping • Early access to sales
                        </>
                      )}
                    </p>
                  </div>
                  {isSecondShow && (
                    <div className="mt-3 text-center">
                      <p
                        className="text-xs font-medium"
                        style={{ color: blue }}
                      >
                        ⏰ This offer won&apos;t appear again for another hour!
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
