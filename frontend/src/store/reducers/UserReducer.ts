import { IUserState } from "store/types/UserType";
import { createReducer } from "typesafe-actions";
import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  REGISTER,
  REGISTER_FAILURE,
  REGISTER_SUCCESS,
  MAIL_AUTH,
  MAIL_AUTH_SUCCESS,
  MAIL_AUTH_FAILURE,
  USER_INFO,
  USER_INFO_SUCCESS,
  USER_INFO_FAILURE,
  MODIFY_INFO,
  MODIFY_INFO_SUCCESS,
  MODIFY_INFO_FAILURE,
  GITHUB_AUTH,
  GITHUB_AUTH_SUCCESS,
  GITHUB_AUTH_FAILURE,
} from "../actions/UserAction";

const userInitialState: IUserState = {
  loginErr: null,
  token: null,
  mailLoading: false,
  registerErr: null,
  registerRes: null,
  mailSendErr: null,
  mailRes: null,
  userData: null,
  loginCheck: false,
  userError: null,
  changeInfoData: null,
  changeInfoErr: null,
};

export const userReducer = createReducer<IUserState>(userInitialState, {
  [LOGIN]: (state, action) => ({
    ...state,
    token: null,
    loginErr: null,
  }),
  [LOGOUT]: (state, action) => ({
    ...state,
    userData: null,
    userError: null,
    loginCheck: false,
  }),
  [LOGIN_SUCCESS]: (state, action) => ({
    ...state,
    token: action.payload,
    loginErr: null,
  }),
  [LOGIN_FAILURE]: (state, action) => ({
    ...state,
    token: null,
    loginErr: action.payload,
  }),
  [REGISTER]: (state, action) => ({
    ...state,
    registerErr: null,
    registerRes: null,
  }),
  [REGISTER_SUCCESS]: (state, action) => ({
    ...state,
    registerRes: action.payload.status,
    registerErr: null,
  }),
  [REGISTER_FAILURE]: (state, action) => ({
    ...state,
    registerRes: null,
    registerErr: action.payload,
  }),
  [MAIL_AUTH]: (state, action) => ({
    ...state,
    mailRes: null,
    mailLoading: true,
    registerErr: null,
  }),
  [MAIL_AUTH_SUCCESS]: (state, action) => ({
    ...state,
    mailRes: action.payload.status,
    mailLoading: false,
    registerErr: null,
  }),
  [MAIL_AUTH_FAILURE]: (state, action) => ({
    ...state,
    mailRes: null,
    mailLoading: false,
    registerErr: action.payload,
  }),
  [USER_INFO]: (state, action) => ({
    ...state,
    userData: null,
    userError: null,
    loginCheck: false,
  }),
  [USER_INFO_SUCCESS]: (state, action) => ({
    ...state,
    userData: {
      name: action.payload.data.name,
      email: action.payload.data.email,
      profileImg: action.payload.data.profile_img,
      is_admin: action.payload.data.is_admin,
      is_github: action.payload.data.is_github,
    },
    loginCheck: true,
    userError: null,
  }),
  [USER_INFO_FAILURE]: (state, action) => ({
    ...state,
    userData: null,
    loginCheck: false,
    userError: action.payload,
  }),
  [MODIFY_INFO]: (state, action) => ({
    ...state,
    changeInfoData: null,
    changeInfoErr: null,
  }),
  [MODIFY_INFO_SUCCESS]: (state, action) => ({
    ...state,
    changeInfoData: action.payload,
    changeInfoErr: null,
  }),
  [MODIFY_INFO_FAILURE]: (state, action) => ({
    ...state,
    changeInfoData: null,
    changeInfoErr: action.payload,
  }),
  [GITHUB_AUTH]: (state, action) => ({
    ...state,
    token: null,
    loginErr: null,
  }),
  [GITHUB_AUTH_SUCCESS]: (state, action) => ({
    ...state,
    token: action.payload.data,
    loginErr: null,
  }),
  [GITHUB_AUTH_FAILURE]: (state, action) => ({
    ...state,
    token: null,
    loginErr: action.payload,
  }),
});
