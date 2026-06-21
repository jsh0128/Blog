import styled, { createGlobalStyle, DefaultTheme } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *{
    margin : 0;
    padding : 0;
  }
  a{ 
   text-decoration : none;
   color: black;
  }
`;

export const DefaultTemplate = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Center = styled.div`
  max-width: 1200px;
  width: 100%;
`;

const color = {
  primaryColor: "#00c897",
};

const size = {
  mobile: "500px",
  tablet: "767px",
  smallDesktop: "900px",
  desktop: "1250px",
};

const mediaQuery = (size: string) =>
  `@media only screen and (max-width:${size})`;

const device = {
  mobile: `${mediaQuery(size.mobile)}`,
  tablet: `${mediaQuery(size.tablet)}`,
  smallDesktop: `${mediaQuery(size.smallDesktop)}`,
  desktop: `${mediaQuery(size.desktop)}`,
};

export const theme: DefaultTheme = {
  device,
  color,
};
