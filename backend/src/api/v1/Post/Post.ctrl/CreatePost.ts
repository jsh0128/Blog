import { Response } from "express";
import { getRepository, Repository } from "typeorm";
import { Category } from "../../../../entity/Category";
import { Post } from "../../../../entity/Post";
import User from "../../../../entity/User";
import { handleResponse } from "../../../../lib/handleResponse";
import AuthRequest from "../../../../types/AuthRequest";

export default async (request: AuthRequest, response: Response) => {
  try {
    const { title, content, category_idx } = request.body;
    console.log(request.user.name);
    const user: User = request.user;

    const postRepository: Repository<Post> = getRepository(Post);
    const cateogoryRepository: Repository<Category> = getRepository(Category);

    const categoryIdx = await cateogoryRepository.findOne(category_idx);
    if (!categoryIdx) {
      console.log("존재하지 않는 카테고리");
      return handleResponse(response, 404, "존재하지 않는 카테고리");
    }
    const post = new Post();
    post.title = title;
    post.content = content;
    post.fk_category_idx = categoryIdx.idx;
    post.fk_user_name = user.name;
    post.fk_user_email = user.email;
    post.created_at = new Date();

    await postRepository.save(post);
    console.log("글 생성 성공");
    handleResponse(response, 200, "글 생성 성공");
    return;
  } catch (err) {
    console.log(err);
    handleResponse(response, 500, "서버 에러");
    return;
  }
};
