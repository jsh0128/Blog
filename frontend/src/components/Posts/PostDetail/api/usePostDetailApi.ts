import { useQuery } from "@tanstack/react-query";
import PostDetailApi from "./PostDetailApi";

export const usePostDetailApi = (id: string) =>
  useQuery(["post", id], () => PostDetailApi.getPostDetail(Number(id)));
