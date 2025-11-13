/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // <-- Google profile images
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "your-upload-domain.com", // future placeholder
      },
    ],
  },

  // ❌ REMOVE `api: { bodyParser:false }` from here (Next.js 14 does not support)
};

export default nextConfig;
