export type Response = {
  status: number;
  message: string;
};

export interface ILoginResponse extends Response {
  data: {
    token: string;
    sendUserInfo: {
      email: string;
      name: string;
      profile_Img: string | null;
    };
  };
}