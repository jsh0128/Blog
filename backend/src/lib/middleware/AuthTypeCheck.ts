import { NextFunction, Request, response, Response } from "express";
import { getRepository, Repository } from "typeorm";
import User from "../../entity/User";
import AuthRequest from "../../types/AuthRequest";
import { handleResponse } from "../handleResponse";
import { verifyToken } from "../jwtToken";

export const validateAdmin = async (
  request: AuthRequest,
  response: Response,
  next: NextFunction
) => {
  try {
    const user: User = await validateAuth(request);
    if (!user || !user.is_admin) {
      console.log("[ERR 403] 노권한");
      handleResponse(response, 403, "권한없음");
      return;
    }

    request.user = user;
    next();
  } catch (err) {
    console.log("User Error   " + err);
    handleResponse(response, 500, "서버 에러입니다");
  }
};
export const validateUser = async (
  request: AuthRequest,
  response: Response,
  next: NextFunction
) => {
  try {
    const user: User = await validateAuth(request);
    request.user = user;
    next();
  } catch (err) {
    console.log("User Error   " + err);
    handleResponse(response, 500, "서버 에러입니다");
  }
};
export const validateAuth = async (request: Request) => {
  const access_token = request.headers["authorization"];
  console.log(request.headers);
  if (!access_token) {
    handleResponse(response, 404, "토큰을 찾을 수 없습니다");
    return;
  } else {
    const bearer = access_token.split(" ");
    const bearerToken = bearer[1];

    try {
      const decodeToken: any = await verifyToken(bearerToken);

      const userRepository: Repository<User> = getRepository(User);
      const user: User = await userRepository.findOne({
        where: { email: decodeToken.email },
      });

      return user;
    } catch (err) {
      throw err;
    }
  }
};
