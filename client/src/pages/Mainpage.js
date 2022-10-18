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
  /* background-color: #ffff0062; */
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  /* align-items: center; */
  padding-bottom: 4rem;
  @media (max-width: 1210px) {
    width: 90vw;
  }
`;

const Loading = styled.div`
  /* border: 1px solid black; */
  display: flex;

  align-items: center;
  flex-direction: column;
  color: gray;
  img {
    width: 3rem;
    /* border: 1px solid black; */
  }
`;

const Mainpage = ({
  togglePick,
  onSearch,
  filteredData,
  pickItems,
  authState,
  setAuthState,
  setFestivalData,
  setFilteredData,
  setPickItems,
}) => {
  const observerTargetEl = useRef(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const offset = useRef(0);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/festivals`,
        { params: { limit: 8, offset: offset.current } }
      );

      const festivals = response.data;
      console.log(festivals);

      setFestivalData((prevData) => [...prevData, ...festivals]);
      // setFestivalData((prevData) => {
      //   console.log(prevData);
      // });

      setFilteredData((prevData) => [...prevData, ...festivals]);

      setHasNextPage(festivals.length === 8);

      if (festivals.length) {
        offset.current += 8;
      }

      if (sessionStorage.getItem('accesstoken')) {
        const authData = await axios.get(
          `${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/users`,
          {
            headers: {
              accesstoken: sessionStorage.getItem('accesstoken'),
            },
          }
        );

        const { userId, account, nickname } = authData.data.data;

        setAuthState({
          userId: userId,
          account: account,
          nickname: nickname,
          loginStatus: true,
        });

        const pickedItems = await axios.get(
          `${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/pick`,
          {
            headers: {
              accesstoken: sessionStorage.getItem('accesstoken'),
            },
          }
        );

        setPickItems(pickedItems.data);

        //* 새로고침시 유저가 픽한 상태도 유지되야 하므로
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);

      setFestivalData([]);
    }
  }, [offset]);

  useEffect(() => {
    console.log('main');

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
  }, [hasNextPage, fetchData]);

  return (
    <Wrapper>
      <SearchAndTag>
        <Search onSearch={onSearch} />
        <Hashtag onSearch={onSearch} />
      </SearchAndTag>
      <FestivalList>
        {!filteredData ? (
          <div>
            <h1 style={{ fontSize: '100px' }}>축제 정보가 없습니다</h1>
          </div>
        ) : (
          filteredData.map((festival) => (
            <Festival
              togglePick={togglePick}
              key={festival.festivalId}
              festival={festival}
              pickItems={pickItems}
            />
          ))
        )}
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
