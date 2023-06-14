/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
};

module.exports = {
  experimental: {
    appDir: true,
  },
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/sitemap.xml",
      },
    ];
  },
};
