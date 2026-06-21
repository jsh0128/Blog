import useCustomRouter from "common/hooks/useCustomRouter";
import styled from "styled-components";
import { useComments } from "./api/useCommentApi";
import CommentItem from "./CommentItem";
import CreateComment from "./CreateComment";

const Comments = () => {
  const {
    query: { id },
  } = useCustomRouter<{ id: number }>();

  const { data } = useComments(id);

  return (
    <Container>
      {data?.map((comment) => (
        <CommentItem key={comment.idx} comment={comment} />
      ))}

      <CreateComment />
    </Container>
  );
};

const Container = styled.div`
  border-top: 1px solid black;
  padding-top: 20px;
`;

export default Comments;
