import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost/api",
  timeout: 10000, // 타임아웃 설정, 10초 내에 응답이 없으면 에러 처리
});

instance.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
