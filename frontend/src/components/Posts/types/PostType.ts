export interface IPost {
  idx: number;
  title: string;
  created_at: string;
  introduction: string;
  preview_image: string;
  user_email: string;
  user_name: string;
  content: string;
  category: string[];
}

export interface ICreatePost {
  title: string;
  content: string;
  introduction: string;
  preview_img: string;
  categories: string[];
}
