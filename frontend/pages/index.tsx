import MainContainer from "container/MainContainer";
import { getPostAsync } from "store/actions/PostAction";
import Head from "next/head";
import { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>{"Blash"}</title>
        <meta
          name="description"
          content="Blash는 개발 정보를 공유하기 위한 블로그 입니다."
        />
        <meta property="og:title" content="Blash" />
        <meta property="og:url" content="http://blash.blog" />
        <meta
          property="og:description"
          content="Blash는 개발 정보를 공유하기 위한 블로그 입니다."
        />
        <meta property="og:url" content="http://blash.blog" />
        <meta
          property="og:image"
          content="https://user-images.githubusercontent.com/52942411/130536036-1bf33ca7-0db6-42ae-ba73-1e2d9bc269b3.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blash" />
        <meta
          name="twitter:description"
          content="Blash는 개발 정보를 공유하기 위한 블로그 입니다."
        />
        <meta
          name="twitter:image"
          content="https://user-images.githubusercontent.com/52942411/130536036-1bf33ca7-0db6-42ae-ba73-1e2d9bc269b3.png"
        />
      </Head>
      <MainContainer />
    </>
  );
};

Home.getInitialProps = async (ctx) => {
  const { dispatch } = ctx.store;

  dispatch(getPostAsync.request({}));

  return;
};

export default Home;
