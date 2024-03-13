import React, { useRef, useState } from "react";
import { Container, Button } from "./styled";
import { hashTagData } from "assets/data/hashTags";

type HashtagProps = {
  onSearch: onSearchFunc;
  tagData: TagData[];
};

type TagData = { text: string };

const HashTags = ({ onSearch, tagData = hashTagData }: HashtagProps) => {
  const { current: tags } = useRef(tagData);
  // const [tags, setTags] = useState<TagData[]>(tagData);

  // TODO : 이렇게 해도 되는지 안되는지 모르겠네
  /**
   * 단독으로 테스트가 되네
   * mock으로 넣어주면 되잖아
   */
  const [curTag, setCurTag] = useState("");

  return (
    <Container>
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

export default HashTags;
