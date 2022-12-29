import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import SearchImage from '../assets/search-mobile.png';

const Form = styled.form`
  width: 90%;
  max-width: 476px;
  height: 43px;
  margin-top: 0.5rem;
  background: white;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: 0 0.1rem 0.3rem 0.01rem lightgray;
  border-radius: 0.7rem;
  position: fixed;
  top: 5rem;

  input {
    width: 100%;
    height: 60%;
    border: none;
    font-size: 1rem;
    border-radius: 0.2rem;
    padding-left: 0.5rem;
    margin-left: 0.5rem;
    background: white;
  }
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    background-image: none;
    font-size: large;
    font-weight: bold;
    border-radius: 0.2rem;

    img {
      height: 50%;
      width: 50%;
    }
  }

  @media (max-width: 475px) {
    border-radius: 9px;
    height: 43px;
    box-shadow: none;

    input::placeholder {
      font-style: normal;
      font-weight: 500;
      font-size: 13px;
      line-height: 16px;
      color: #978d8d;
    }
  }
`;

type onSearchProps = {
  onSearch: onSearchFunc;
  isTag: boolean;
  setIsTag: React.Dispatch<React.SetStateAction<boolean>>;
};

const Search = ({ onSearch, isTag, setIsTag }: onSearchProps) => {
  /*
  검색하다가 태그누르면 검색어가 지워저야함
  태그가 눌러졌다는 것을 알아야함
  태그를 누를 때는 검색어 searchText를 빈값으로 해주어야함
  Mainpage에서 
  isTag라는 것을 만들어서
  태그를 클릭할 때 isTag를 true로 만들어주고
  search는 isTag를 props로 받아서 isTag가 true면 검색창을 비워준다.
  */
  const [searchText, setSearchText] = useState('');

  const onClickHandler = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onSearch(searchText);
      setIsTag(false);
    },
    [searchText]
  );
  const onChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value);
    },
    []
  );

  useEffect(() => {
    if (isTag) {
      setSearchText('');
    }
  }, [isTag]);
  return (
    <Form onSubmit={onClickHandler}>
      <input
        onChange={onChangeHandler}
        placeholder="축제를 검색해 주세요"
        value={searchText}
      />
      <button type="submit">
        <img src={SearchImage} alt="search"></img>
      </button>
    </Form>
  );
};

export default Search;
