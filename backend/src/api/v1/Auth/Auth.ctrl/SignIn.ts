import { Request, Response } from "express";
import { getRepository, Repository } from "typeorm";
import User from "../../../../entity/User";
import { handleResponse } from "../../../../lib/handleResponse";
import { createToken } from "../../../../lib/jwtToken";

export default async (request: Request, response: Response) => {
  try {
    const { email, password } = request.body;
    const userRepository: Repository<User> = getRepository(User);
    const emailCheck = await userRepository.findOne({
      where: { email },
    });

    if (!emailCheck) {
      handleResponse(response, 404, "없는 회원입니다");
      return;
    }

    const userInfo = await userRepository.findOne({
      where: { email: email, password: password },
    });

    if (!userInfo) {
      handleResponse(
        response,
        401,
        "이메일 또는 비밀번호가 올바르지 않습니다."
      );
      return;
    }

    if (userInfo) {
      const token: string = await createToken(
        userInfo.email,
        userInfo.name,
        userInfo.profile_img,
        userInfo.is_admin,
        userInfo.is_github
      );

      console.log("로그인 성공하셨습니다");
      handleResponse(response, 200, "로그인 성공하셨습니다", token);
      return;
    }
  } catch (err) {
    console.log(err);

    console.log("서버 오류입니다.");
    handleResponse(response, 500, "서버 오류입니다.");
    return;
  }
};
