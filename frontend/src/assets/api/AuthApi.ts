import {
  CertMailPayload,
  ChangeInfoPayload,
  LoginPayload,
  RegisterPayload,
} from "assets/types/AuthPayLoadTypes";
import axios, { AxiosResponse } from "axios";
import { IGetInfoResponse, ILoginResponse } from "util/types/Response";
import { SERVER } from "../../config/config.json";
import { Response } from "util/types/Response";
import customAxios from "lib/CustomAxios";
import { sha512 } from "js-sha512";

const AuthApi = {
  login: async ({ email, pw }: LoginPayload) => {
    const body = {
      email,
      password: sha512(pw),
    };
    const { data }: AxiosResponse<ILoginResponse> = await axios.post(
      `${SERVER}/auth/signin`,
      body
    );
    return { token: data.data.token };
  },

  register: async ({
    name,
    email,
    password,
    profileImg,
    authCode,
  }: RegisterPayload) => {
    const body = {
      name,
      email,
      password: sha512(password),
      profileImg,
      certCode: authCode,
    };
    const { data }: AxiosResponse<Response> = await axios.post(
      `${SERVER}/auth/signup`,
      body
    );

    return data;
  },
  certMail: async ({ email }: CertMailPayload) => {
    const body = {
      email,
    };
    const { data }: AxiosResponse<Response> = await axios.post(
      `${SERVER}/auth/emailCode`,
      body
    );

    return data;
  },
  getInfo: async () => {
    const { data }: AxiosResponse<IGetInfoResponse> = await customAxios.get(
      `${SERVER}/auth/getInfo`
    );
    return data;
  },
  changeInfo: async ({ name, password, profile_img }: ChangeInfoPayload) => {
    const body = {
      name: name,
      password: sha512(password),
      profile_img: profile_img,
    };
    const { data }: AxiosResponse<Response> = await customAxios.post(
      `${SERVER}/auth/changeInfo`,
      body
    );
    return data;
  },
};
export default AuthApi;
