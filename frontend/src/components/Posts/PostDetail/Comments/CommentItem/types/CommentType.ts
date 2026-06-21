export interface IComment {
  idx: number;
  content: string;
  created_at: string;
  user_email: string;
  user_name: string;
  user_profile_img: string;
}

export interface IPostComment {
  post_idx: number;
  content: string;
}
