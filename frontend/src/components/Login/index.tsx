import { useEffect } from "react";
import qs from "qs";
import Router from "next/router";
import styled from "styled-components";
import { useMutation } from "@tanstack/react-query";
import AuthApi from "./api/AuthApi";
import { useCookies } from "react-cookie";

const GithubAuthContainer = () => {
  const [_, setToken] = useCookies(["token"]);

  const { mutate } = useMutation(AuthApi.getToken, {
    onSuccess: ({ data }) => {
      setToken("token", data, {
        path: "/",
      });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  useEffect(() => {
    const { code } = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    });

    mutate(code);

    Router.push("/");
  }, []);

  return (
    <Container>
      <span>Github Login중..</span>
    </Container>
  );
};

const Container = styled.div`
  height: calc(100vh - 2.5rem);
  flex-direction: column;
`;

export default GithubAuthContainer;
