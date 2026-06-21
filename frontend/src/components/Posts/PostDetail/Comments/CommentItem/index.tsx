import dayjs from "dayjs";
import Image from "next/image";
import styled from "styled-components";
import { IComment } from "./types/CommentType";

interface Props {
  comment: IComment;
}

const CommentItem = ({ comment }: Props) => {
  return (
    <Container>
      <Image
        className="img"
        src={comment.user_profile_img}
        alt={`${comment.user_name} 사진`}
        width={50}
        height={50}
        priority={false}
      />
      <div className="info">
        <div className="info-top">
          <span className="info-top-name">{comment.user_name}</span>
          <span className="info-top-time">
            {dayjs(comment.created_at).format("YYYY-MM-DD HH:mm:ss")}
          </span>
        </div>
        <div className="info-content">{comment.content}</div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  margin-bottom: 10px;
  display: flex;
  .img {
    border-radius: 10px;
  }

  .info {
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    &-top {
      &-name {
        font-weight: bold;
      }
      &-time {
        padding-left: 5px;
        font-size: 13px;
        color: #5e5e5e;
      }
    }
  }
`;

export default CommentItem;
