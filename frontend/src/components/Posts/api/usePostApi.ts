import { useMutation, useQuery } from "@tanstack/react-query";
import CategoryApi from "components/common/DefaultTemplate/SideBar/api/CategoryApi";
import PostApi from "./PostApi";
import { usePostUpdater } from "./usePostUpdater";

export const usePostApi = (id?: number) =>
  useQuery(["posts", id], () => {
    return id ? CategoryApi.getCategoryPosts(id) : PostApi.getPosts();
  });

export const useCreatePost = () => {
  const { postUpdater } = usePostUpdater();
  const { mutate: createPostMutate } = useMutation(PostApi.createPost, {
    onSuccess: async (_, request) => {
      postUpdater(request);
    },
  });

  return { createPostMutate };
};
