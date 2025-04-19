/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    viewTransition: true,
  },
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
        hostname: "https://pub-7f190ec6a9c04e3e9220da81bf6e3ec9.r2.dev",
        port: "",
      },
      {
        protocol: "https",
        hostname: "1abnppqngbtuiv5y.public.blob.vercel-storage.com",
        port: "",
      },
      // {
      //   protocol: "https",
      //   hostname: "pub-e94a2a2980874e3ab621fd44043e7eca.r2.dev",
      //   port: "",
      // },
    ],
  },
};

export default nextConfig;
