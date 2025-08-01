import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ulisha Store",
    short_name: "Ulisha",
    description: "Your one-stop shop for all things Ulisha",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0068d6ff",
    icons: [
      {
        src: "/favicon.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  };
}