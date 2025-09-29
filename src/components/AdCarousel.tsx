/**
 * Copyright (c) 2025 Ulisha Limited
 *
 * This file is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * You may obtain a copy of the License at:
 *
 *     https://creativecommons.org/licenses/by-nc/4.0/
 *
 */


import { useRef, useEffect, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation, Pagination, Autoplay } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { supabase } from "@/lib/supabase";
import { NavigationOptions } from "swiper/types";
import { Database } from "@/supabase-types";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

type Advertisement = Database["public"]["Tables"]["advertisements"]["Row"];

interface AdCarouselProps {
  className?: string;
}

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

export function AdCarousel({ className = "" }: AdCarouselProps) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const checkNetworkConnectivity = () => {
    return navigator.onLine;
  };

  const fetchAds = useCallback(async (retryCount = 0): Promise<void> => {
    try {
      if (!checkNetworkConnectivity()) {
        throw new Error("No internet connection");
      }

      setIsLoading(true);
      setError(null);

      if (!supabase) {
        throw new Error("Supabase client is not configured");
      }

      const { data, error: supabaseError } = await supabase
        .from("advertisements")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });

      if (supabaseError) {
        console.error("Supabase error:", supabaseError);
        throw supabaseError;
      }

      setAds(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching ads:", error);

      if (retryCount < MAX_RETRIES) {
        const retryDelay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
        await delay(retryDelay);
        return fetchAds(retryCount + 1);
      }

      let errorMessage = "Unable to load advertisements. ";
      if (!checkNetworkConnectivity()) {
        errorMessage += "Please check your internet connection.";
      } else if (!supabase) {
        errorMessage += "Supabase configuration is missing.";
      } else if (error instanceof Error) {
        errorMessage += `Error: ${error.message}`;
      } else {
        errorMessage += "An unexpected error occurred.";
      }

      setError(errorMessage);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAds();

    const subscription = supabase
      .channel("advertisements")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "advertisements" },
        () => fetchAds()
      )
      .subscribe();

    const handleOnline = () => {
      if (error) {
        fetchAds();
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", () => {
      setError("No internet connection. Please check your network.");
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", () => {});
    };
  }, [error, fetchAds]);

  if (isLoading) {
    return (
      <div
        className={`relative h-[250px] sm:h-[350px] md:h-[400px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 rounded-lg overflow-hidden shadow-lg ${className} max-w-7xl mx-auto`}
      >
        <div className="animate-pulse flex items-center gap-2 text-gray-600 text-lg font-medium">
          <svg
            className="animate-spin h-5 w-5 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading advertisements...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`relative h-[250px] sm:h-[350px] md:h-[400px] flex items-center justify-center bg-gradient-to-br from-red-50 to-red-200 rounded-lg overflow-hidden shadow-lg ${className} max-w-7xl mx-auto`}
      >
        <div className="text-red-700 text-center p-4">
          <p className="font-bold text-xl mb-2">Error!</p>
          <p>{error}</p>
          <p className="text-sm mt-2">Please try again later.</p>
        </div>
      </div>
    );
  }

  if (ads.length === 0) {
    return null;
  }

  return (
    <div className={`relative group max-w-7xl mx-auto ${className}`}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
        // Reduced width by 20px on left and right using negative margin
        className="h-[250px] sm:h-[350px] md:h-[400px] rounded-xl overflow-hidden shadow-2xl -mx-5 sm:-mx-10"
        onInit={(swiper) => {
          const navigation = swiper.params.navigation as NavigationOptions;
          navigation.prevEl = prevRef.current;
          navigation.nextEl = nextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();
        }}
      >
        {ads.map((ad) => (
          <SwiperSlide key={ad.id}>
            <div
              className="relative w-full h-full bg-cover bg-center flex items-center justify-center p-4 sm:p-6 md:p-8"
              style={{ backgroundImage: `url(${ad.image_url})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

              <div className="relative z-10 text-white text-center max-w-2xl mx-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 sm:mb-4 leading-tight drop-shadow-lg">
                  {ad.title}
                </h2>
                <p className="text-base sm:text-lg mb-5 sm:mb-6 opacity-90 drop-shadow-md">
                  {ad.description}
                </p>
                <a
                  href={ad.button_link}
                  // Changed button color to blue with white text
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg uppercase tracking-wide"
                >
                  {ad.button_text}
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        ref={prevRef}
        className="absolute top-1/2 left-4 z-20 -translate-y-1/2 flex items-center justify-center w-10 h-10 bg-white/30 hover:bg-white/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75 backdrop-blur-sm"
        aria-label="Previous advertisement"
      >
        <FontAwesomeIcon icon={faChevronLeft} className="text-xl" />
      </button>
      <button
        ref={nextRef}
        className="absolute top-1/2 right-4 z-20 -translate-y-1/2 flex items-center justify-center w-10 h-10 bg-white/30 hover:bg-white/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75 backdrop-blur-sm"
        aria-label="Next advertisement"
      >
        <FontAwesomeIcon icon={faChevronRight} className="text-xl" />
      </button>
    </div>
  );
}
