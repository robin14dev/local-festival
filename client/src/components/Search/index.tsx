import React, { useState, useCallback, useEffect } from "react";
import { SearchIcon } from "../../assets";
import { Form } from "./styled";

type onSearchProps = {
  onSearch: onSearchFunc;
  // isTag: boolean;
  // setIsTag: React.Dispatch<React.SetStateAction<boolean>>;
};

const Search = ({ onSearch }: onSearchProps) => {
  /*
  검색하다가 태그누르면 검색어가 지워저야함
  태그가 눌러졌다는 것을 알아야함
  태그를 누를 때는 검색어 searchText를 빈값으로 해주어야함
  Main에서 
  isTag라는 것을 만들어서
  태그를 클릭할 때 isTag를 true로 만들어주고
  search는 isTag를 props로 받아서 isTag가 true면 검색창을 비워준다.
  */
  const [searchText, setSearchText] = useState("");

  const onSubmitHandler = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onSearch(searchText);
      // setIsTag(false);
    },
    [searchText]
  );
  const onChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value);
    },
    []
  );

  return (
    <Form onSubmit={onSubmitHandler}>
      <input
        type="search"
        onChange={onChangeHandler}
        placeholder="축제를 검색해 주세요"
        value={searchText}
      />
      <button type="submit">
        <img src={SearchIcon} alt="search"></img>
      </button>
    </Form>
  );
};

export default Search;
