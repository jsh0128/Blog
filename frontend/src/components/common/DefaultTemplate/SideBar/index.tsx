import styled from "styled-components";
import { useCategoryApi } from "./api/useCategoryApi";
import CategoryItem from "./CategoryItem";

const SideBar = () => {
  const { data } = useCategoryApi();

  return (
    <Container>
      <div className="category">
        {data?.map((category) => (
          <CategoryItem key={category.idx} {...category} />
        ))}
      </div>
    </Container>
  );
};

const Container = styled.div`
  .category {
    top: 60px;
    border-left: 1px solid black;
    padding: 5px;
    position: sticky;
  }
  width: 200px;
`;

export default SideBar;
