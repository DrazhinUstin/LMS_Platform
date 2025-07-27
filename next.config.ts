import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/a/**',
        search: '',
      },
      new URL('https://avatars.githubusercontent.com/u/**/*?v=4'),
    ],
  },
};

export default nextConfig;
