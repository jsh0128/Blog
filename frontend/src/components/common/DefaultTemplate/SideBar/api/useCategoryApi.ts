import { useQuery } from "@tanstack/react-query";
import CategoryApi from "./CategoryApi";

export const useCategoryApi = () =>
  useQuery(["category"], CategoryApi.getCategory);

export const useCategoryPosts = (idx: number) =>
  useQuery(["posts"], () => CategoryApi.getCategoryPosts(idx));
