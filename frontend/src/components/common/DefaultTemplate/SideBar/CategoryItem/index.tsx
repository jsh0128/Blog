import { useRouter, useSearchParams } from "next/navigation";
import styled from "styled-components";

interface Props {
  category: string;
  idx: number;
}

const CategoryItem = ({ category }: Props) => {
  const selected = useSearchParams().get("category");

  const { push } = useRouter();

  return (
    <Container
      onClick={() => {
        selected === category ? push("/") : push(`/?category=${category}`);
      }}
      selected={selected === category}
    >
      {category}
    </Container>
  );
};

const Container = styled.div<{ selected?: boolean }>`
  margin: 3px 0;
  cursor: pointer;
  ${({ selected }) => selected && "font-weight : bold"}
`;

export default CategoryItem;
