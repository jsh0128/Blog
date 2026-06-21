import { Request, Response } from "express";
import { getRepository, Repository } from "typeorm";
import { Category } from "../../../../entity/Category";
import { handleResponse } from "../../../../lib/handleResponse";

export default async (request: Request, response: Response) => {
  try {
    const { category } = request.body;
    const categoryRepository: Repository<Category> = getRepository(Category);

    const findCategory = await categoryRepository.findOne({
      where: { category: category },
    });

    if (!findCategory) {
      handleResponse(response, 404, "없는 카테고리입니다.");
      return;
    }

    await categoryRepository.delete(findCategory);
    console.log("카테고리를 정상적으로 삭제하였습니다.");
    handleResponse(response, 200, "카테고리를 정상적으로 삭제하였습니다");
    return;
  } catch (err) {
    console.log(err);
    handleResponse(response, 500, "서버");
    return;
  }
};
