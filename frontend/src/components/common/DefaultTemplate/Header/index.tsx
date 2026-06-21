import { Center } from "common/style/GlobalStyle";
import Button from "components/common/Button";
import { useMeInfoApi } from "components/Login/api/useAuthApi";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";

const Header = () => {
  const redirectUrl = `${process.env.NEXT_PUBLIC_URL}/login`;

  const { push } = useRouter();

  const { data } = useMeInfoApi();

  const name = data?.data.data.name;
  const isAdmin = data?.data.data.is_admin;

  return (
    <Container>
      <Center className="header">
        <Link href="/">Blash</Link>
        <div>
          {name ? (
            <span className="header-name">{name}</span>
          ) : (
            <Link
              href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GIT_CLIENT_ID}&redirect_uri=${redirectUrl}`}
            >
              깃허브 로그인
            </Link>
          )}

          {isAdmin && (
            <Button
              onClick={() => push("/post/create")}
              style={{ marginLeft: "1rem" }}
            >
              글쓰기
            </Button>
          )}
        </div>
      </Center>
    </Container>
  );
};

const Container = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  box-shadow: 2px 2px 2px #00000033;
  padding: 5px 0;
  a {
    font-size: 25px;
    padding-left: 5px;
    font-weight: bold;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-name {
      font-weight: 500;
      font-size: 16px;
    }
  }
`;

export default Header;
