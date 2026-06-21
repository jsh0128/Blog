import { useQueryClient } from "@tanstack/react-query";
import { useCategoryApi } from "components/common/DefaultTemplate/SideBar/api/useCategoryApi";
import { useMeInfoApi } from "components/Login/api/useAuthApi";
import dayjs from "dayjs";
import { ICreatePost, IPost } from "../types/PostType";
import { usePostApi } from "./usePostApi";

export const usePostUpdater = () => {
  const queryClient = useQueryClient();

  const { data } = usePostApi();

  const { data: info } = useMeInfoApi();

  const name = info?.data.data.name;
  const email = info?.data.data.email;

  const postUpdater = (post: ICreatePost) => {
    const idx = data.length ? data[0].idx + 1 : 1;

    const newPost: IPost = {
      ...post,
      created_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      idx: idx,
      preview_image: post.preview_img,
      user_email: name,
      user_name: email,
      category: post.categories,
    };

    queryClient.setQueryData<IPost[]>(["posts", null], (oldData) => {
      const newData = [newPost, ...oldData];

      return newData;
    });
  };

  return { postUpdater };
};
