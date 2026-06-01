import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  serverExternalPackages: [
    "tesseract.js",
    "sharp",
    "pdf-lib",
    "pdfkit",
    "libreoffice-convert",
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.amazonaws.com" },
      { protocol: "https", hostname: "*.cloudinary.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("canvas", "jsdom");
    }
    config.resolve.alias.canvas = false;
    return config;
  },
};
export default nextConfig;
