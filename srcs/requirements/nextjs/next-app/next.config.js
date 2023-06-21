// next.config.js
module.exports = {
  async headers() {
    return [
      {
        // 경로만 사용해 주세요, 전체 URL은 아닙니다.
        source: "/oauth/authorize/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, PUT, POST, DELETE, PATCH",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};
