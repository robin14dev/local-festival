import React, { useEffect, useRef, useState } from "react";
import { Container, Button } from "./styled";
import { AxiosError } from "axios";

type HashtagProps = {
  onSearch: onSearchFunc;
  query: string | null;
  // setIsTag: React.Dispatch<React.SetStateAction<boolean>>;
};

const tagsArr = [
  {
    text: "봄나들이",
  },
  {
    text: "불빛축제",
  },
  {
    text: "역사탐방",
  },
];

type TagData = { text: string };

const HashTag = ({ onSearch, query }: HashtagProps) => {
  const [tags, setTags] = useState<TagData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [curTag, setCurTag] = useState(query);

  // useEffect(() => {
  //   setCurTag(query);
  // }, [query]);

  const fetchTags = async () => {
    function delay(ms: number) {
      const promise = new Promise((resolve, reject) => setTimeout(resolve, ms));
    }
    try {
      setLoading(true);
      await delay(5000);
      setTags(tagsArr);
    } catch (error: unknown) {
      setError("태그를 불러오는데 실패했습니다");
      if (error instanceof AxiosError) {
        console.log(error);
        setError("태그를 불러오는데 실패했습니다");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <Container>
      {loading && "축제 태그를 불러오고 있습니다"}
      {!!error && error}
      {tags.map((tag) => (
        <Button
          active={curTag === tag.text}
          onClick={() => {
            onSearch(tag.text);
            setCurTag(tag.text);
            // setIsTag(true);
          }}
          key={tag.text}
        >
          #{tag.text}
        </Button>
      ))}
    </Container>
  );
};

export default HashTag;
