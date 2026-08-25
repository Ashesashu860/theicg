import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep Admin (and jwks-rsa/jose) as Node requires — bundling breaks jose@6 ESM.
  serverExternalPackages: ["firebase-admin"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.google.com",
      },
    ],
  },
};

export default nextConfig;
