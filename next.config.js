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
    unoptimized: true, // <--- THIS IS THE MAGIC FIX FOR FIREBASE!
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
      },
    ],
  },
  outputFileTracingRoot: path.join(__dirname),
};

module.exports = nextConfig;