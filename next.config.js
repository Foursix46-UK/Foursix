const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // isomorphic-dompurify pulls in jsdom to sanitize blog HTML on the server. Leaving it
  // external keeps webpack from trying to bundle jsdom's optional native deps, which is
  // the usual cause of a build that passes locally and fails on deploy.
  serverExternalPackages: ["isomorphic-dompurify", "jsdom"],

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Optimization re-enabled: images were being served at full original size
    // straight from Firebase Storage. Firebase's webframeworks integration runs the
    // Next.js image optimizer inside the SSR function (uses `sharp`).
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: '/**',
      },
      // CMS images are proxied through our own domain via /media/[...path]
      {
        protocol: "https",
        hostname: "foursix46.com",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "www.foursix46.com",
        pathname: "/media/**",
      },
    ],
  },
  outputFileTracingRoot: path.join(__dirname),
};

module.exports = nextConfig;