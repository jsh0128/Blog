import * as jwt from "jsonwebtoken";
import "dotenv/config";

const { JWT_SECRET_KEY } = process.env;

export const createToken = (
  email: string,
  name: string,
  profile: string,
  is_admin: boolean,
  is_github: boolean
) => {
  // 토큰 만들기
  return jwt.sign(
    {
      email,
      name,
      profile,
      is_admin,
      is_github,
    },
    JWT_SECRET_KEY,
    {
      expiresIn: "30d",
    }
  );
};

export const verifyToken = (token) => {
  // 토큰 유효성 검사
  return jwt.verify(token, JWT_SECRET_KEY);
};
