import {
  GET_CATEGORY,
  GET_CATEGORY_FAILURE,
  GET_CATEGORY_SUCCESS,
  GET_POST_CATEGORY,
  GET_POST_CATEGORY_FAILURE,
  GET_POST_CATEGORY_SUCCESS,
} from "store/actions/CategoryAction";
import {
  IGetCategoryState,
  IGetPostCategoryState,
} from "store/types/CategoryType";
import { createReducer } from "typesafe-actions";

const getCategoryInitialState: IGetCategoryState = {
  getCategoryData: null,
  getCategoryErr: null,
};

export const GetCategoryReducer = createReducer<IGetCategoryState>(
  getCategoryInitialState,
  {
    [GET_CATEGORY]: (state, action) => ({
      ...state,
      getCategoryData: null,
      getCategoryErr: null,
    }),
    [GET_CATEGORY_SUCCESS]: (state, action) => ({
      ...state,
      getCategoryData: action.payload,
      getCategoryErr: null,
    }),
    [GET_CATEGORY_FAILURE]: (state, action) => ({
      ...state,
      getCategoryData: null,
      getCategoryErr: action.payload,
    }),
  }
);

const getPostCategoryInitialState: IGetPostCategoryState = {
  getPostCategoryData: null,
  getPostCategoryErr: null,
};

export const GetPostCategoryReducer = createReducer<IGetPostCategoryState>(
  getPostCategoryInitialState,
  {
    [GET_POST_CATEGORY]: (state, action) => ({
      ...state,
    }),
    [GET_POST_CATEGORY_SUCCESS]: (state, action) => ({
      ...state,
      getPostCategoryData: action.payload,
      getPostCategoryErr: null,
    }),
    [GET_POST_CATEGORY_FAILURE]: (state, action) => ({
      ...state,
      getPostCategoryData: null,
      getPostCategoryErr: action.payload,
    }),
  }
);