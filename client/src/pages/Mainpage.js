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
  margin: 0 auto 5rem auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  @media (max-width: 475px) {
    margin: 0;
  }
`;

const SearchAndTag = styled.div`
  width: 100vw;
  height: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 5rem;
  z-index: 1;
  background-color: white;
  @media (max-width: 475px) {
    background-color: var(--mainColor);
    padding: 0;
  }
`;

const FestivalList = styled.section`
  width: 88%;
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
  margin: 0 auto;
  max-width: 40rem;
  padding-top: 92px;
  display: flex;
  justify-content: space-between;
  svg {
    width: 50%;
    height: 100%;
  }
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
    font-size: 2rem;
    line-height: 48px;

    color: #6268ff;
  }

  p {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 1.2rem;
    line-height: 29px;

    span {
      color: #ff9a62;
    }
  }
  @media screen and (max-width: 485px) {
    width: 100%;
    flex-direction: column;
    padding: 0;

    svg {
      margin: 0 auto;
    }
    h1 {
      font-size: 1.5rem;
    }
    p {
      font-size: 1rem;
    }
  }
`;
const Mainpage = ({
  togglePick,
  filteredData,
  pickItems,
  offset,
  setFestivalData,
  setFilteredData,
}) => {
  console.log('Mainpage 렌더링');
  const [searchParams, setSearchParams] = useSearchParams();
  const observerTargetEl = useRef(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState(searchParams.get('query'));

  console.log(
    'Mainpage filteredData.length ,isLoading, offset : ',
    filteredData.length,
    isLoading,
    offset
  );

  const navigate = useNavigate();
  console.log(navigate);
  const fetchData = useCallback(async () => {
    console.log('fetchDaata offset', offset);
    setIsLoading(true);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/festivals`,
        { params: { limit: 8, offset: offset.current, query } }
      );

      const festivals = response.data;

      setFestivalData((prevData) => [...prevData, ...festivals]);
      setFilteredData((prevData) => [...prevData, ...festivals]);
      setHasNextPage(festivals.length === 8);

      if (festivals.length) {
        offset.current += 8;
        sessionStorage.setItem('offset', offset);
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setFestivalData([]);
    }
  }, [offset, query]);

  const onSearch = (searchText) => {
    try {
      setSearchParams({ query: '' });

      sessionStorage.removeItem('offset');
      navigate(`/search?query=${searchText}`);
      setQuery(searchText);
      setFilteredData([]);
      setHasNextPage(true);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    console.log('useEffect!!');
    console.log(observerTargetEl.current, hasNextPage);
    if (!observerTargetEl.current || !hasNextPage) return;
    const callback = (entries, observer) => {
      console.log(
        'callback함수 호출, offset, enrties[0].isInterSecting : ',
        offset,
        entries[0].isIntersecting
      );
      if (offset.current === 0) {
        fetchData();
        return;
      }

      if (entries[0].isIntersecting) {
        console.log('intersecting true!!');
        fetchData();
      }
    };
    const io = new IntersectionObserver(callback);

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
