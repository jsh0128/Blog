import axios from "common/lib/axios";
import { IResponse } from "common/types";
import { ICreatePost, IPost } from "../types/PostType";

class PostApi {
  getPosts = async () => {
    const {
      data: { data },
    }: IResponse<IPost[]> = await axios.get("/post/getPost");

    return data;
  };

  createPost = async (body: ICreatePost) => {
    const { data } = await axios.post("/post/create", body);

    return data;
  };
}

export default new PostApi();
