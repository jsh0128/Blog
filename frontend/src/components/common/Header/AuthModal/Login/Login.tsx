import { CustomInput, CustomBtn } from "components/common/Basic/Basic";
import { KeyboardEvent } from "react";
import styled from "styled-components";
import { Inputs, AuthType, CustomSpan } from "../AuthStyle";
import GoogleLogin from "react-google-login";
import { OAUTH_CLIENT_ID } from "config/config.json";

interface LoginProps {
  id: string;
  setId: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  onClickLogin: () => void;
  setSelectedAuth: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  keyDownEvent: (e: KeyboardEvent<HTMLInputElement>) => void;
}

const Login = ({
  id,
  setId,
  password,
  setPassword,
  onClickLogin,
  setSelectedAuth,
  loading,
  keyDownEvent,
}: LoginProps) => {
  return (
    <>
      {loading ? (
        <Forms>
          <AuthType>로그인</AuthType>
          <Inputs>
            <CustomInput
              onKeyDown={keyDownEvent}
              placeholder="이메일"
              onChange={(e) => setId(e.target.value)}
              value={id}
            />
            <CustomInput
              placeholder="비밀번호"
              onKeyDown={keyDownEvent}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Inputs>
          <Inputs>
            <CustomBtn onClick={onClickLogin}>로그인</CustomBtn>

            <CustomSpan onClick={() => setSelectedAuth(true)}>
              회원가입 Let's get it~
            </CustomSpan>
            <CustomOAuth clientId={OAUTH_CLIENT_ID} />
          </Inputs>
        </Forms>
      ) : (
        <span>...로딩중</span>
      )}
    </>
  );
};

const CustomOAuth = styled(GoogleLogin)`
  width: 90%;
  margin-top: 1rem;
  border-radius: 10rem;
`;

const Forms = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;
`;
export default Login;
