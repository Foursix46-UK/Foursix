/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Optimization re-enabled: images were being served at full original size
    // (some 4000-6000px wide source files shown in a ~390px card) straight from
    // Firebase Storage, which is what made blog/newsroom images slow and, on some
    // devices, fail to render at all. Firebase's webframeworks integration runs
    // the Next.js image optimizer inside the SSR Cloud Function (needs the `sharp`
    // package, already a dependency here), so this is safe to turn back on.
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
    ],
  },
};

module.exports = nextConfig;