import customAxios from "common/lib/axios";
import { IResponse } from "common/types";
import { IPost } from "components/Posts/types/PostType";
import { ICategory } from "../types/CategoryType";

class CategoryApi {
  getCategory = async () => {
    const {
      data: { data },
    }: IResponse<ICategory[]> = await customAxios.get("/category/getCategory");

    return data;
  };

  getCategoryPosts = async (categoryIdx: number) => {
    const {
      data: { data },
    }: IResponse<IPost[]> = await customAxios.get(
      "/category/searchpostcategory",
      {
        params: {
          category: categoryIdx,
        },
      }
    );

    return data;
  };
}

export default new CategoryApi();
