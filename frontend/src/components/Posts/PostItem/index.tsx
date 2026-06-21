import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { IPost } from "../types/PostType";

import dayjs from "dayjs";

interface Props {
  post: IPost;
}

const PostItem = ({ post }: Props) => {
  return (
    <Container href={`/post/${post.idx}`}>
      <article>
        <div className="img_container">
          <Image
            alt={`${post.title}_썸네일`}
            src={post.preview_image}
            width={200}
            height={100}
          />
        </div>
        <div className="info">
          <h3>{post.title}</h3>
          <span>{dayjs(post.created_at).format("YYYY-MM-DD")}</span>
          <section>{post.introduction}</section>
        </div>
      </article>
    </Container>
  );
};

const Container = styled(Link)`
  display: block;
  width: 100%;
  text-decoration: none;
  background-color: #e7e7e7;
  border-radius: 20px;
  max-height: 300px;
  .img_container {
    max-height: 200px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .info {
    padding: 5px 10px 10px 10px;
  }
`;

export default PostItem;
