/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...any other configurations you might have

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.daisyui.com',
        port: '',
        pathname: '/images/stock/**', // Allows any image from this path
      },
    ],
  },
};

module.exports = nextConfig;