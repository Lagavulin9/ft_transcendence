/** @type {import('next').NextConfig} */

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
