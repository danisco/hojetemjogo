/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.api-sports.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media-3.api-sports.io',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/dia/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=900, stale-while-revalidate=59',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
