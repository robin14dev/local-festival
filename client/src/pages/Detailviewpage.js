import React, { useState, useEffect } from 'react';
import DescTab from '../components/DescTab';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import ReviewTab from '../components/ReviewTab';
import HeartButton from '../components/HeartButton';
import onErrorImage from '../assets/noimage.png';

const Wrapper = styled.div`
  margin: 10rem auto;
  display: flex;
  width: 81rem; //큰 화면에서 넓어지는 것 때문에 퍼센트말고 rem으로 고정
  /* height: 70rem; */
  height: auto;
  overflow: visible;
  justify-content: space-evenly;
  border-radius: 1rem;
  /* margin: 3rem auto; */

  @media (max-width: 1290px) {
    width: 70rem;
  }

  @media (max-width: 1100px) {
    width: 60rem;
  }

  @media (max-width: 840px) {
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 94rem;
    & > div:nth-child(1) {
      margin: 1rem 0;
    }
    & > div:nth-child(2) {
      width: 22rem;
    }
  }
`;

const ImageAndPickbtn = styled.div`
  margin-top: 5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 22rem;
  height: 30rem;
  /* border: 1px solid black; */
  box-shadow: 0.1rem 0.1rem 0.5rem gray;
  border-radius: 1rem;
  & > * {
  }
  & > img {
    width: 100%;
    height: 80%;
    border-radius: 1rem;
    padding: 0.5rem;
    /* border: 1.5px solid #1564a9; */
    position: relative;
  }

  & > :nth-child(2) {
    width: 3rem;
    height: 3rem;
    border: none;
    position: relative;
    left: 0.5rem;
  }
`;
const TabAndDesc = styled.div`
  width: 60%;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-radius: 1rem;
  /* padding: 0 1rem; */
  /* margin: 1rem; */
  /* margin-left : 3rem; */
  box-shadow: 0.1rem 0.1rem 0.3rem gray;

  @media (max-width: 1100px) {
    width: 40%;
  }
`;

const Tab = styled.div`
  width: 100%;
  height: 5rem;
  color: rgba(73, 73, 73, 0.5);
  font-weight: bold;
  font-size: 1.5rem;
  display: flex;
  flex-direction: row;
  justify-items: center;
  align-items: center;
  list-style: none;
  border-radius: 0.5rem 0.5rem 0 0;
  background-color: aliceblue;
  box-shadow: 0 0 2px 0 gray;

  & > div {
    width: 100%;
  }

  /* margin-bottom: 7rem; */

  .submenu {
    width: 100%;
    height: 100%;
    /* padding: 15px 10px; */
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.5rem 0.5rem 0 0;
  }

  .focused {
    background-color: #1564a9;

    color: rgba(255, 255, 255, 1);
    transition: 0.3s;
  }

  & div.desc {
    text-align: center;
  }
`;

const Detailviewpage = ({ pickItems, togglePick, authState }) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [like, setLike] = useState(false);

  const { state } = useLocation();
  console.log('what si state', state);

  const { imageUrl, title, festivalId } = state;
  const onErrorImg = (e) => {
    e.target.src = onErrorImage;
  };

  const tabArr = [
    { name: '상세정보', content: <DescTab festivalInfo={state} /> },
    {
      name: '리뷰',
      content: <ReviewTab authState={authState} festivalInfo={state} />,
    },
  ];

  useEffect(() => {
    const isPicked = pickItems.some((ele) => ele.festivalId === festivalId);
    setLike(isPicked);
  }, [festivalId, pickItems]);
  const toggleLike = (event) => {
    // event.stopPropagation();
    setLike(!like);
  };
  const onClickPick = (event, festival) => {
    event.stopPropagation();
    togglePick(festival);
    toggleLike();
  };

  return (
    <Wrapper>
      <ImageAndPickbtn>
        <img
          src={imageUrl || onErrorImage}
          alt={`${title} : 이미지가 존재하지 않습니다.`}
          onError={onErrorImg}
        ></img>

        {authState.loginStatus ? (
          <HeartButton
            like={like}
            onClick={(event) => {
              onClickPick(event, state);
            }}
          />
        ) : null}
      </ImageAndPickbtn>
      <TabAndDesc>
        <Tab>
          {tabArr.map((ele, index) => {
            return (
              <div
                key={index}
                className={currentTab === index ? 'submenu focused' : 'submenu'}
                onClick={() => setCurrentTab(index)}
              >
                {ele.name}
              </div>
            );
          })}
        </Tab>
        {tabArr[currentTab].content}
      </TabAndDesc>
    </Wrapper>
  );
};

export default Detailviewpage;
