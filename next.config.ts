import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exportación estática para Firebase Hosting
  output: "export",
  
  // Trailing slash para mejor compatibilidad con hosting estático
  trailingSlash: true,
  
  // Configuración de imágenes
  images: {
    unoptimized: true, // Necesario para export estático
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
