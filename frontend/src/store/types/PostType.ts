import { AxiosError } from "axios";

export interface IGetPostState {
  data: { res: PostState[] | PostState | null };
  getPostErr: AxiosError | null;
}

export interface PostState {
  category: string[];
  content: string;
  created_at: string;
  idx: number;
  introduction: string;
  preview_image: null | string;
  title: string;
  user_email: string;
  user_name: string;
}

export interface ICreatePostState {}