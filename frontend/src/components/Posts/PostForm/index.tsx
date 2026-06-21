import Button from "components/common/Button";
import { useCategoryApi } from "components/common/DefaultTemplate/SideBar/api/useCategoryApi";
import Markdown from "components/common/Markdown";
import { useState } from "react";
import styled from "styled-components";
import { useCreatePost } from "../api/usePostApi";

const PostForm = () => {
  const { createPostMutate } = useCreatePost();

  const { data } = useCategoryApi();

  const [title, setTitle] = useState("");
  const [intro, setIntro] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const [categories, setCategories] = useState<string[]>([]);

  const [content, setContent] = useState("");

  const onClickCategory = (category: string) => {
    setCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((filterCategory) => filterCategory !== category);
      }

      return prev.concat(category);
    });
  };

  const onClickCreatePost = () => {
    createPostMutate({
      title,
      introduction: intro,
      categories,
      content,
      preview_img: thumbnail,
    });
  };

  return (
    <Container>
      <input
        className="title"
        placeholder="제목"
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="intro"
        placeholder="소개글"
        onChange={(e) => setIntro(e.target.value)}
      />

      <input
        type="thumbnail"
        placeholder="썸네일 이미지 링크"
        onChange={(e) => setThumbnail(e.target.value)}
      />

      <div className="categories">
        {data?.map((category) => (
          <CategorySelected
            onClick={() => onClickCategory(category.category)}
            className="categories-item"
            selected={categories.includes(category.category)}
            key={category.idx}
          >
            {category.category}
          </CategorySelected>
        ))}
      </div>

      <textarea
        onChange={({ target }) => {
          setContent(target.value);
        }}
      />
      <Markdown content={content} />

      <Button onClick={onClickCreatePost}>글생성</Button>
    </Container>
  );
};

const Container = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  .categories {
    display: flex;
    align-items: center;
    margin: 5px 0;
  }
  textarea {
    width: 100%;
    height: 20vh;
  }
`;

const CategorySelected = styled.div<{ selected?: boolean }>`
  margin: 0 5px;
  padding: 5px 8px;
  background-color: #dcdcdc;
  border-radius: 5px;
  cursor: pointer;
  ${({ selected }) => selected && "font-weight : bold;"}
`;

export default PostForm;
