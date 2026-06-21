import { CSSProperties, ReactNode } from "react";
import styled from "styled-components";

interface Props {
  children: ReactNode;
  style?: CSSProperties;
  onClick?: VoidFunction;
}

const Button = ({ children, style, onClick }: Props) => {
  return (
    <Container onClick={onClick} style={style}>
      {children}
    </Container>
  );
};

const Container = styled.button`
  padding: 5px 10px;
  border-radius: 2px;
  border: 1px solid black;
  background-color: black;
  color: white;
  transition: 0.2s;
  cursor: pointer;
  &:hover {
    background-color: white;
    color: black;
    border: 1px solid black;
  }
`;

export default Button;
