import React from 'react';
import Hashtag from '../components/Hashtag';
import Search from '../components/Search';
import styled from 'styled-components';
import Festival from '../components/Festival';
import { useRef } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { useCallback } from 'react';
import loadImg from '../assets/loading.gif';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ReactComponent as NoData } from '../assets/noData.svg';
const Wrapper = styled.div`
  margin: 0 auto 5rem auto; // ㅇㅒ로 해결!!!
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 475px) {
    margin: 0;
  }
`;

const SearchAndTag = styled.div`
  width: 100%;
  height: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 5rem;
  z-index: 1;
  /* padding: 1rem; */
  /* border: 3px solid green; */
  background-color: white;

  @media (max-width: 475px) {
    background-color: ${(props) => props.theme.usingColor.mainColor};
    width: 100%;
    padding: 0;
    /* display: block; */
  }
`;

const FestivalList = styled.section`
  width: 76rem;
  margin-top: 12rem;
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 4rem;
  @media (max-width: 1210px) {
    width: 90vw;
  }
`;

const Loading = styled.div`
  display: flex;

  align-items: center;
  flex-direction: column;
  color: gray;
  img {
    width: 3rem;
  }
`;

const ErrorMsg = styled.section`
  width: 40rem;
  padding-top: 92px;
  display: flex;
  justify-content: space-between;
  & > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  h1 {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 40px;
    line-height: 48px;

    color: #6268ff;
  }

  p {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 29px;

    span {
      color: #ff9a62;
    }
  }
`;
const Mainpage = ({
  togglePick,
  filteredData,
  pickItems,

  setFestivalData,
  setFilteredData,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const observerTargetEl = useRef(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState(searchParams.get('query'));
  const offset = useRef(0);

  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/festivals`,
        { params: { limit: 8, offset: offset.current, query } }
      );

      const festivals = response.data;

      setFestivalData((prevData) => [...prevData, ...festivals]);

      setFilteredData((prevData) => [...prevData, ...festivals]);

      setHasNextPage(festivals.length === 8);

      if (festivals.length) {
        offset.current += 8;
      }

      //   //* 새로고침시 유저가 픽한 상태도 유지되야 하므로
      // }
      setIsLoading(false);
    } catch (error) {
      console.log(error);

      setFestivalData([]);
    }
  }, [offset, query]);

  /*
  useEffect로 현재 쿼리가 있다면 해당 쿼리와 offset(0부터 시작)을 보내주기
  
  onSearch 버튼을 누르는 것은 setQuery를 해주는 것이 아니라
  navigate로 url을 바꿔줌 
  쿼리가 바꼈으니깐 useEffect 실행해서 가져오기 


  tag쿼리 작동법 멀아프네
  https://travel.naver.com/domestic/tagContents?tag=드라이브코스&key=tagContents-3v1fnmng9jn

  변하지 않는? 지정되어 있는 자료를 불러오는 거니깐

  방법1)
  태그를 클릭한다
  url이 태그명으로 바뀐다.
  tagContent의 상태가 바뀐다.
  endpoint가 다른 걸로 보낸다 예상되는 문제 : 기존 searchData작동?


  방법2) 가능 이걸로하자
  태그를 클릭한다
  query가 태그명으로 바뀐다
  서버에서 해당쿼리명에 저장된 항목이 태그배열안에 있으면 로직을 실행한다.

  */

  const onSearch = async (searchText) => {
    console.log('onSearch!!', searchText);
    try {
      setSearchParams({ query: '' });
      offset.current = 0;
      navigate(`/search?query=${searchText}`);
      setQuery(searchText);
      setFilteredData([]);
      setHasNextPage(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log('useEffect 실행 , query : ', query, hasNextPage);

    if (!observerTargetEl.current || !hasNextPage) return;

    console.log('넘어와');
    const io = new IntersectionObserver((entries, observer) => {
      if (entries[0].isIntersecting) {
        fetchData();
      }
    });

    io.observe(observerTargetEl.current);

    return () => {
      io.disconnect();
    };
  }, [hasNextPage, fetchData, query]);

  return (
    <Wrapper>
      <SearchAndTag>
        <Search onSearch={onSearch} />
        <Hashtag onSearch={onSearch} />
      </SearchAndTag>
      <FestivalList>
        {filteredData.length === 0 && (
          <ErrorMsg>
            <NoData />
            <div>
              <h1>No Result Found</h1>
              <p>
                <span>'{query}'</span> 에 대한 <br></br> 축제정보가 존재하지
                않습니다
              </p>
            </div>
          </ErrorMsg>
        )}

        {filteredData.map((festival) => (
          <Festival
            togglePick={togglePick}
            key={festival.festivalId}
            festival={festival}
            pickItems={pickItems}
          />
        ))}
      </FestivalList>
      {isLoading ? (
        <Loading>
          축제들을 불러오고 있습니다
          <img src={loadImg} alt="loading"></img>
        </Loading>
      ) : null}
      <div ref={observerTargetEl}></div>
    </Wrapper>
  );
};

export default Mainpage;
