import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import AxiosType from "util/enums/AxiosType";
import { SERVER } from "config/config.json";
interface CustomAxios {
  url: string;
  body?: object;
  configCheck: boolean;
  type: AxiosType;
}

const addToken = (config: AxiosRequestConfig) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers["authorization"] = `Bearer ${token}`;
  }

  return config;
};

const customAxios = axios.create({ baseURL: SERVER });

customAxios.interceptors.request.use(addToken);

export default customAxios;
