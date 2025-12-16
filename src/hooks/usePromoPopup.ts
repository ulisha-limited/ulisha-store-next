/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export function usePromoPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const user = useAuthStore((state) => state.user);

  const checkAndShowPopup = () => {
    const now = Date.now();
    const popupData = localStorage.getItem("promo_popup_data");

    let shouldShow = false;
    let delay = 3000; // Default 3 seconds delay

    if (!popupData) {
      // First time visitor - show popup after 3 seconds
      shouldShow = true;
    } else {
      try {
        const data = JSON.parse(popupData);
        const { lastShown, showCount, hourStart } = data;

        // Check if it's been more than an hour since the hour started
        const hoursPassed = (now - hourStart) / (1000 * 60 * 60);

        if (hoursPassed >= 1) {
          // Reset for new hour
          shouldShow = true;
          delay = 3000;
        } else if (showCount < 2) {
          // Within the same hour, but haven't shown twice yet
          const timeSinceLastShown = now - lastShown;
          const minTimeBetweenShows = 30 * 60 * 1000; // 30 minutes minimum

          if (timeSinceLastShown >= minTimeBetweenShows) {
            shouldShow = true;
            delay = 5000; // Slightly longer delay for second show
          }
        }
        // If showCount >= 2 and still within the hour, don't show
      } catch (error) {
        // Invalid data, treat as first time
        shouldShow = true;
      }
    }

    if (shouldShow) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  };

  const closePopup = () => {
    setShowPopup(false);

    const now = Date.now();
    const popupData = localStorage.getItem("promo_popup_data");

    let newData;

    if (!popupData) {
      // First time showing
      newData = {
        lastShown: now,
        showCount: 1,
        hourStart: now,
      };
    } else {
      try {
        const data = JSON.parse(popupData);
        const hoursPassed = (now - data.hourStart) / (1000 * 60 * 60);

        if (hoursPassed >= 1) {
          // New hour, reset count
          newData = {
            lastShown: now,
            showCount: 1,
            hourStart: now,
          };
        } else {
          // Same hour, increment count
          newData = {
            lastShown: now,
            showCount: data.showCount + 1,
            hourStart: data.hourStart,
          };
        }
      } catch (error) {
        // Invalid data, treat as first time
        newData = {
          lastShown: now,
          showCount: 1,
          hourStart: now,
        };
      }
    }

    localStorage.setItem("promo_popup_data", JSON.stringify(newData));
  };

  useEffect(() => {
    // Only show popup for non-logged-in users
    if (!user) {
      checkAndShowPopup();
    }
  }, [user]);

  const resetPopup = () => {
    localStorage.removeItem("promo_popup_data");
    setShowPopup(false);
  };

  const getPopupStatus = () => {
    const popupData = localStorage.getItem("promo_popup_data");
    if (!popupData) return { showCount: 0, timeUntilNext: 0 };

    try {
      const data = JSON.parse(popupData);
      const now = Date.now();
      const hoursPassed = (now - data.hourStart) / (1000 * 60 * 60);

      if (hoursPassed >= 1) {
        return { showCount: 0, timeUntilNext: 0 };
      }

      const timeSinceLastShown = now - data.lastShown;
      const minTimeBetweenShows = 30 * 60 * 1000; // 30 minutes
      const timeUntilNext = Math.max(
        0,
        minTimeBetweenShows - timeSinceLastShown,
      );

      return {
        showCount: data.showCount,
        timeUntilNext: data.showCount < 2 ? timeUntilNext : 0,
      };
    } catch (error) {
      return { showCount: 0, timeUntilNext: 0 };
    }
  };

  return {
    showPopup,
    closePopup,
    resetPopup,
    getPopupStatus,
  };
}
