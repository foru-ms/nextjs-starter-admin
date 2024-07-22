/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/:model',
        destination: '/[model]',
      },
    ];
  },
};

export default nextConfig;
