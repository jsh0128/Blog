import axios, { InternalAxiosRequestConfig } from "axios";
import { Cookies } from "react-cookie";

const customAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ADDRESS,
});

export const setHeader = (config: InternalAxiosRequestConfig) => {
  const cookie = new Cookies();

  const token = cookie.get("token");

  if (config.headers) {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
};

customAxios.interceptors.request.use(setHeader);

export default customAxios;
