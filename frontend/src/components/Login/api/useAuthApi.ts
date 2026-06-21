import { useQuery } from "@tanstack/react-query";
import AuthApi from "./AuthApi";

export const useMeInfoApi = () =>
  useQuery(["meInfo"], () => AuthApi.getMeInfo());
