/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "images.unsplash.com",
      "scontent-fra3-1.xx.fbcdn.net", // Facebook CDN
    ],
  },
};

module.exports = nextConfig;