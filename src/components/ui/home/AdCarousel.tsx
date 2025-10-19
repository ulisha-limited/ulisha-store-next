/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation, Pagination, Autoplay } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { NavigationOptions } from "swiper/types";
import { Database } from "@/supabase-types";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

type Advertisement = Database["public"]["Tables"]["advertisements"]["Row"];

export function AdCarousel({
  advertisements,
}: {
  advertisements: Advertisement[];
}) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  if (advertisements.length === 0) {
    return null;
  }

  return (
    <div className="relative group max-w-7xl mx-auto">
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
        {advertisements.map((ad) => (
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
