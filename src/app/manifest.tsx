/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */


 import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ulisha Store",
    short_name: "Ulisha",
    description: "Your one-stop shop for all things Ulisha",
    start_url: "/",
    display: "standalone",
    display_override: ["window-controls-overlay", "standalone"],
    background_color: "#ffffff",
    theme_color: "#0068d6ff",
    icons: [
      {
        src: "/ulisha-store-icon-96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        src: "/ulisha-store-icon-144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        src: "/ulisha-store-icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/ulisha-store-icon.png",
        sizes: "500x500",
        type: "image/png",
      },
    ],
    shortcuts: [
      {
        name: "Cart",
        short_name: "Cart",
        description: "View your cart",
        url: "/cart",
        icons: [
          {
            src: "/icons/cart.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
        ],
      },
      {
        name: "Orders",
        short_name: "Orders",
        description: "View your orders",
        url: "/my-account/orders",
        icons: [
          {
            src: "/icons/list.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
        ],
      },
      {
        name: "My Account",
        short_name: "Account",
        description: "Manage your account",
        url: "/my-account",
        icons: [
          {
            src: "/icons/user.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
        ],
      },
    ],
  };
}
