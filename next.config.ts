import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      "tesseract.js",
      "sharp",
      "pdf-lib",
      "pdfkit",
      "libreoffice-convert",
    ],
  },
  serverExternalPackages: ["libreoffice-convert"],
  api: {
    bodyParser: {
      sizeLimit: "500mb",
    },
  },
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
