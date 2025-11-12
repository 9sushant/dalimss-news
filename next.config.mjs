/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "your-upload-domain.com", // <-- optional (later for uploaded images)
      },
    ],
  },

  api: {
    bodyParser: false, // ✅ required for file uploads (formidable)
  },
};

export default nextConfig;
