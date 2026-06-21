import { dehydrate, QueryClient } from "@tanstack/react-query";
import CategoryApi from "components/common/DefaultTemplate/SideBar/api/CategoryApi";
import AuthApi from "components/Login/api/AuthApi";
import Posts from "components/Posts";
import PostApi from "components/Posts/api/PostApi";
import { GetServerSideProps } from "next";
import React from "react";

const Home: React.FC = () => {
  return <Posts />;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["meInfo"], () =>
    AuthApi.getMeInfo(ctx.req.cookies.token)
  );

  await queryClient.prefetchQuery(["category"], CategoryApi.getCategory);

  await queryClient.prefetchQuery(["posts"], PostApi.getPosts);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Home;
