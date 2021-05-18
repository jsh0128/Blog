import { NextFunction, Request, Response } from "express";
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
    console.log(err);
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
    console.log(err);
    handleResponse(response, 500, "서버 에러입니다");
  }
};
export const validateAuth = async (request: Request) => {
  const access_token = request.headers["token"];
  console.log(access_token);
  try {
    const decodeToken: any = await verifyToken(access_token);

    const userRepository: Repository<User> = getRepository(User);
    const user: User = await userRepository.findOne({
      where: { email: decodeToken.email },
    });

    return user;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
