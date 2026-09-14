/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable persistent Webpack disk caching in dev mode to permanently prevent cache corruption overlays
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
