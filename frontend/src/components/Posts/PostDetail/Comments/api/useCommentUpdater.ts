import { useQueryClient } from "@tanstack/react-query";
import { useMeInfoApi } from "components/Login/api/useAuthApi";
import dayjs from "dayjs";
import { IComment, IPostComment } from "../CommentItem/types/CommentType";

export const useCommentUpdater = () => {
  const queryClient = useQueryClient();

  const { data } = useMeInfoApi();

  const name = data?.data.data.name;
  const email = data?.data.data.email;
  const profile_img = data?.data.data.profile_img;

  const commentUpdater = (comment: IPostComment) => {
    queryClient.setQueryData<IComment[]>(
      ["comments", Number(comment.post_idx)],
      (oldData) => {
        const newComment: IComment = {
          content: comment.content,
          idx: oldData.length + 1,
          created_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
          user_email: email,
          user_name: name,
          user_profile_img: profile_img,
        };

        const newData = [newComment, ...oldData];

        return newData;
      }
    );
  };

  return { commentUpdater };
};
