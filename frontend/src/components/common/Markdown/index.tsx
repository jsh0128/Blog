import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import styled from "styled-components";

interface Props {
  content?: string;
}

const Markdown = ({ content }: Props) => {
  return (
    <Container>
      <ReactMarkdown
        children={content}
        components={{
          code(props) {
            const { children, className, node, ...rest } = props;
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <SyntaxHighlighter
                {...rest}
                PreTag="div"
                children={String(children).replace(/\n$/, "")}
                language={match[1]}
              />
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            );
          },
        }}
      />
    </Container>
  );
};

const Container = styled.article`
  width: 100%;
  p:first-child {
    margin-top: 0;
  }
  p {
    margin: 15px 0;
  }
  img {
    width: 100%;
  }
`;

export default Markdown;
