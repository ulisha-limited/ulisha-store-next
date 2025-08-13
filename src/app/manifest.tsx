import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ulisha Store",
    short_name: "Ulisha",
    description: "Your one-stop shop for all things Ulisha",
    start_url: "/",
    display: "standalone",
    background_color: "#0068d6ff",
    theme_color: "#0068d6ff",
    icons: [
      {
        src: "/favicon.png",
        sizes: "192x192",
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
            src: "/favicon.png",
            sizes: "192x192",
            type: "image/png",
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
            src: "/favicon.png",
            sizes: "192x192",
            type: "image/png",
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
            src: "/favicon.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      }
    ],
  };
}