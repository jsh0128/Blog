import { useCategoryApi } from "components/common/DefaultTemplate/SideBar/api/useCategoryApi";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { usePostApi } from "./api/usePostApi";
import PostItem from "./PostItem";

const Posts = () => {
  const selected = useSearchParams().get("category");

  const [categoryIdx, setCategoryIdx] = useState<number>();

  const { data: categories } = useCategoryApi();

  const { data: posts } = usePostApi(categoryIdx);

  useEffect(() => {
    const selectedCategory = categories?.find(
      (category) => category.category === selected
    );

    selectedCategory
      ? setCategoryIdx(selectedCategory.idx)
      : setCategoryIdx(undefined);
  }, [selected]);

  return (
    <Container>
      {posts?.map((post) => (
        <PostItem key={post.idx} post={post} />
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  gap: 20px;
  padding: 10px 20px;
  height: 100%;
  ${({ theme }) => theme.device.tablet} {
    grid-template-columns: 1fr 1fr;
  }
  ${({ theme }) => theme.device.mobile} {
    grid-template-columns: 1fr;
  }
  grid-template-columns: 1fr 1fr 1fr;
`;

export default Posts;
