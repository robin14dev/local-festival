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
  background-color: white;

  @media (max-width: 475px) {
    background-color: var(--mainColor);
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
  background-color: yellow;
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

  let offset = +sessionStorage.getItem('offset') || 0;

  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/festivals`,
        { params: { limit: 8, offset, query } }
      );

      const festivals = response.data;

      setFestivalData((prevData) => [...prevData, ...festivals]);
      setFilteredData((prevData) => [...prevData, ...festivals]);
      setHasNextPage(festivals.length === 8);

      if (festivals.length) {
        offset += 8;
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
    if (!observerTargetEl.current || !hasNextPage) return;
    const callback = (entries, observer) => {
      if (offset === 0) {
        fetchData();
        return;
      }

      if (entries[0].isIntersecting) {
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
