import axios from "common/lib/axios";
import { IResponse } from "common/types";
import { IPost } from "components/Posts/types/PostType";

class PostDetailApi {
  getPostDetail = async (idx: number) => {
    const { data }: IResponse<IPost> = await axios.get("/post/getPost", {
      params: { idx },
    });

    return data;
  };
}

export default new PostDetailApi();
