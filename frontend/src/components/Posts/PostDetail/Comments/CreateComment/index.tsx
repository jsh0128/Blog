import useCustomRouter from "common/hooks/useCustomRouter";
import Button from "components/common/Button";
import { useState } from "react";
import styled from "styled-components";
import { usePostComment } from "../api/useCommentApi";

const CreateComment = () => {
  const {
    query: { id },
  } = useCustomRouter<{ id: number }>();

  const { commentMutate } = usePostComment();

  const [comment, setComment] = useState("");

  const onClickCreateBtn = () => {
    commentMutate({
      content: comment,
      post_idx: id,
    });

    setComment("");
  };

  return (
    <Container>
      <textarea
        placeholder="입력하세요 :)"
        onChange={(e) => setComment(e.target.value)}
      />
      <div className="btn">
        <Button onClick={onClickCreateBtn}>작성</Button>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  margin: 15px 0 20px 0;
  textarea {
    padding: 10px;
    margin: 0;
    width: calc(100% - 20px);
    resize: none;
    border: 1px solid black;
    border-radius: 3px;
    &:focus {
      outline: none;
    }
  }
  .btn {
    display: flex;
    justify-content: flex-end;
  }
`;

export default CreateComment;
