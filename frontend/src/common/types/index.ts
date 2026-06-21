import { AxiosResponse } from "axios";

export interface IResponse<T> extends AxiosResponse {
  data: { data: T };
  message: string;
  status: number;
}
