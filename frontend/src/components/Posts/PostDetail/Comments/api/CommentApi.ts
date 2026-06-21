import customAxios from "common/lib/axios";
import { IResponse } from "common/types";
import { IComment, IPostComment } from "../CommentItem/types/CommentType";

class CommentApi {
  getComments = async (idx: number) => {
    const {
      data: { data },
    }: IResponse<IComment[]> = await customAxios.get("/comment/getComment", {
      params: {
        post_idx: idx,
      },
    });

    return data;
  };

  postComment = async (body: IPostComment) => {
    const { data } = await customAxios.post("/comment/create", body);

    return data;
  };
}

export default new CommentApi();
