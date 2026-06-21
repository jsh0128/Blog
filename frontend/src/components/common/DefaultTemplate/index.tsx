import { Center } from "common/style";
import { ReactNode } from "react";
import styled from "styled-components";
import SideBar from "./SideBar";
import Header from "./Header";

interface Props {
  children: ReactNode;
}

const DefaultTemplate = ({ children }: Props) => {
  return (
    <>
      <Header />
      <Center>
        <Container>
          {children}
          <SideBar />
        </Container>
      </Center>
    </>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  width: 100%;
  padding: 10px 0;
  height: 100%;
`;

export default DefaultTemplate;
