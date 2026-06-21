import { useMutation, useQuery } from "@tanstack/react-query";
import CommentApi from "./CommentApi";
import { useCommentUpdater } from "./useCommentUpdater";

export const useComments = (idx: number) =>
  useQuery(["comments", Number(idx)], () => CommentApi.getComments(idx));

export const usePostComment = (
  onSuccess?: () => void,
  onError?: () => void
) => {
  const { commentUpdater } = useCommentUpdater();

  const { mutate: commentMutate } = useMutation(CommentApi.postComment, {
    onSuccess: async (_, request) => {
      await commentUpdater(request);

      onSuccess && onSuccess();
    },
    onError: () => {
      onError && onError();
    },
  });

  return { commentMutate };
};
