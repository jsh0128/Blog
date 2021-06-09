import {
  CreatePostPayload,
  DeletePostPayload,
  GetPostPayload,
  ModifyPostPayload,
} from "assets/types/PostPayLoadType";
import axios, { AxiosResponse } from "axios";
import { IGetPostResponse } from "util/types/PostResponse";
import { SERVER } from "../../config/config.json";

const PostApi = {
  getPosts: async ({ postIdx }: GetPostPayload) => {
    const { data }: AxiosResponse<IGetPostResponse> = await axios.get(
      postIdx
        ? `${SERVER}/post/getPost?idx=${postIdx}`
        : `${SERVER}/post/getPost`
    );

    return { res: data?.data };
  },
  createPosts: async ({
    title,
    content,
    introduction,
    categories,
    preview_img,
  }: CreatePostPayload) => {
    const body = {
      title,
      content,
      introduction,
      categories,
      preview_img,
    };
    let config = {};
    if (localStorage.getItem("access_token")) {
      config = {
        headers: {
          token: `${localStorage.getItem("access_token")}`,
        },
      };
    }
    const { data }: AxiosResponse<any> = await axios.post(
      `${SERVER}/post/create`,
      body,
      config
    );

    return data;
  },
  modifyPosts: async ({
    title,
    content,
    post_idx,
    categories,
  }: ModifyPostPayload) => {
    const body = {
      title,
      content,
      categories,
      post_idx,
    };
    let config = {};
    if (localStorage.getItem("access_token")) {
      config = {
        headers: {
          token: `${localStorage.getItem("access_token")}`,
        },
      };
    }
    const { data }: AxiosResponse<any> = await axios.post(
      `${SERVER}/post/modify`,
      body,
      config
    );
    return data;
  },
  deletePosts: async ({ post_idx }: DeletePostPayload) => {
    const body = { post_idx };
    let config = {};
    if (localStorage.getItem("access_token")) {
      config = {
        headers: {
          token: `${localStorage.getItem("access_token")}`,
        },
      };
    }
    const { data }: AxiosResponse<any> = await axios.post(
      `${SERVER}/post/delete`,
      body,
      config
    );
    return data;
  },
};

export default PostApi;
