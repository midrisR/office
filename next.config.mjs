/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: {
      resolveAlias: {
        canvas: false,
      },
    },
  },
};
export default nextConfig;
