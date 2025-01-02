/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/books/:id",
        missing: [
          {
            type: "query",
            key: "page",
          },
        ],
        destination: "/books/:id?page=1",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        port: "",
      },
      {
        protocol: "https",
        hostname: "1abnppqngbtuiv5y.public.blob.vercel-storage.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
