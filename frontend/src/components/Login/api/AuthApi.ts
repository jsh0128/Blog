import customAxios from "common/lib/axios";
import { IResponse } from "common/types";
import { IMeInfo } from "../types/AuthType";

class AuthApi {
  getToken = async (code: string) => {
    const { data }: IResponse<string> = await customAxios.post(
      "/auth/githubAuth",
      { code }
    );

    return data;
  };

  getMeInfo = async (token?: string) => {
    if (token) {
      const { data }: IResponse<IMeInfo> = await customAxios.get(
        "/auth/getInfo",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { data };
    }

    const { data }: IResponse<IMeInfo> = await customAxios.get("/auth/getInfo");

    return { data };
  };
}

export default new AuthApi();
