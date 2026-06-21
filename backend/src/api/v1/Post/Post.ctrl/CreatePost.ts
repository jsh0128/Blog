import { Response } from "express";
import { getRepository, Repository } from "typeorm";
import { Category } from "../../../../entity/Category";
import { Post } from "../../../../entity/Post";
import { PostCategory } from "../../../../entity/PostCategory";
import User from "../../../../entity/User";
import { handleResponse } from "../../../../lib/handleResponse";
import AuthRequest from "../../../../types/AuthRequest";

export default async (request: AuthRequest, response: Response) => {
  try {
    const { title, content, introduction, categories, preview_img } =
      request.body;

    const user: User = request.user;

    if (!user) {
      console.log("로그인이 필요합니다");

      return handleResponse(response, 403, "로그인이 필요합니다");
    }

    const postRepository: Repository<Post> = getRepository(Post);
    const categoryRepository: Repository<Category> = getRepository(Category);
    const postCategoryRepository: Repository<PostCategory> =
      getRepository(PostCategory);

    let category;
    let categoryArray = [];

    if (categories) {
      // 카테고리가 있는건지 검사
      for (let i in categories) {
        category = await categoryRepository.findOne({
          where: { category: categories[i] },
        });
        if (!category) {
          console.log("존재하지 않는 카테고리가 있습니다.");
          return handleResponse(
            response,
            404,
            "존재하지 않는 카테고리가 있습니다."
          );
        }
        categoryArray.push(category.idx);
      }
    }

    const post = new Post();
    post.title = title;
    post.content = content;
    post.introduction = introduction;
    post.fk_user_email = user.email;
    post.preview_image = preview_img;
    post.created_at = new Date();

    await postRepository.save(post);
    for (let i in categoryArray) {
      const postCategory: PostCategory = new PostCategory();
      postCategory.fk_category_idx = categoryArray[i];
      postCategory.fk_post_idx = post.idx;
      await postCategoryRepository.save(postCategory);
    }

    console.log("글 생성 성공");
    handleResponse(response, 200, "글 생성 성공");
    return;
  } catch (err) {
    console.log(err);
    handleResponse(response, 500, "서버 에러");
    return;
  }
};
