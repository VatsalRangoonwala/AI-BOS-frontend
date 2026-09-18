import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AI-BOS",
    short_name: "AI-BOS",
    description: "An AI-assisted business workspace for sales, stock, customers and payments.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#f7f8fc",
    theme_color: "#635bff",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
