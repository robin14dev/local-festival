import React, { useState, useCallback, useEffect } from "react";
import { SearchIcon } from "../../assets";
import { Form } from "./styled";

type onSearchProps = {
  onSearch: onSearchFunc;
};

const Search = ({ onSearch }: onSearchProps) => {
  const [searchText, setSearchText] = useState("");
  const onSubmitHandler = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onSearch(searchText);
     
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
        autoFocus
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
