import {
  CategorySearchPostPayload,
  CreateCategoryPayload,
  ModifyCategoryPayload,
  DeleteCategoryPayload,
} from "assets/types/CategoryPayLoadType";
import { AxiosResponse } from "axios";
import customAxios from "lib/CustomAxios";
import {
  IGetCategoryResponse,
  ISearchCategoryPostResponse,
} from "util/types/CategoryResponse";
import { Response } from "util/types/Response";
const CategoryApi = {
  getCategory: async () => {
    const { data }: AxiosResponse<IGetCategoryResponse> = await customAxios.get(
      `/category/getCategory`
    );

    return { res: data.data };
  },
  getPostCategory: async ({ category }: CategorySearchPostPayload) => {
    const {
      data,
    }: AxiosResponse<ISearchCategoryPostResponse> = await customAxios.get(
      `/category/searchPostCategory?category=${category}`
    );

    return { res: data?.data };
  },
  createCategory: async ({ category }: CreateCategoryPayload) => {
    const body = {
      category,
    };
    const { data }: AxiosResponse<Response> = await customAxios.post(
      `/category/create`,
      body
    );

    return data;
  },
  modifyCategory: async ({ category, changeName }: ModifyCategoryPayload) => {
    const body = {
      category_name: category,
      change_name: changeName,
    };
    const { data }: AxiosResponse<Response> = await customAxios.post(
      `/category/modify`,
      body
    );

    return data;
  },
  deleteCategory: async ({ category }: DeleteCategoryPayload) => {
    const body = {
      category,
    };
    const { data }: AxiosResponse<Response> = await customAxios.post(
      `/category/delete`,
      body
    );

    return data;
  },
};

export default CategoryApi;
