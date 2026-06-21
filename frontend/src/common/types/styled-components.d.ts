import "styled-components";
import { theme } from "util/style/GlobalStyle";

declare module "styled-components" {
  export interface DefaultTheme {
    device: {
      mobile: string;
      tablet: string;
      smallDesktop: string;
      desktop: string;
    };
    color: {
      primaryColor: string;
    };
  }
}
