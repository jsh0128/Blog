import useCustomRouter from "common/hooks/useCustomRouter";
import dayjs from "dayjs";
import Image from "next/image";
import styled from "styled-components";
import { usePostDetailApi } from "./api/usePostDetailApi";
import Comments from "./Comments";
import Markdown from "components/common/Markdown";

const PostDetail = () => {
  const {
    query: { id },
  } = useCustomRouter<{ id: string }>();

  const {
    data: {
      data: { category, content, created_at, preview_image, title },
    },
  } = usePostDetailApi(id);

  return (
    <Container>
      <header className="title">
        <h1>{title}</h1>
        <span className="title-time">
          {dayjs(created_at).format("YYYY-MM-DD")}
        </span>
      </header>
      <div className="img_container">
        <Image
          alt={`${title}_썸네일`}
          src={preview_image}
          width={200}
          height={100}
        />
      </div>

      <article className="content">
        <Markdown content={content} />
      </article>

      <Comments />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: 10px 20px 0 20px;

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-time {
      color: #5e5e5e;
    }
  }

  .img_container {
    overflow: hidden;
    margin-top: 10px;
    img {
      max-height: 500px;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;

export default PostDetail;
