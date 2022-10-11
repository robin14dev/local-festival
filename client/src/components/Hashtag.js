import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  height: 3rem;
  width: 100vw;
  /* box-shadow: 0 1px 2px 0  lightgray; */
  background-color: white;
  position: fixed;
  top: 9rem;
  display: flex;
  justify-content: center;

  font-family: 'HS-Regular';
  font-family: 'GangwonEdu_OTFBoldA';
  font-family: 'NanumSquareRound';
  font-weight: bold;

  /* box-shadow: 0.1rem 1rem 0.2rem  gray; */

  & button {
    width: max-content;
    height: max-content;
    padding: 0.1rem 0.5rem;
    color: 'red';
    border-radius: 1rem;
    box-shadow: 0 0.1rem 0.1rem 0.01rem lightgray;
    font: inherit;
    margin-left: 1rem;
    font-size: 1rem;
    background-color: white;
    transition: all 0.1s ease-in;

    &:hover {
      background-color: 'red';

      color: 'red';
    }
    &:visited {
      color: #4968bd;
    }
  }

  @media (max-width: 1210px) {
    width: 100vw;
  }
  @media (max-width: 1010px) {
    width: 100vw;
  }
  @media (max-width: 675px) {
    width: 100vw;
    margin-top: 1rem;
    /* height: 30%; */
  }
  @media (max-width: 475px) {
    display: none;
  }
`;

const Month = styled.div``;

const Location = styled.div``;

const Hashtag = ({ onSearch }) => {
  const onClickMonth = (e) => {
    const monthTags = e.target.parentNode.children;
    console.log(monthTags);
    console.log(e.target.parentNode.parentNode.children[1].children);
    const LocationTags = e.target.parentNode.parentNode.children[1].children;
    for (let i = 0; i < monthTags.length; i++) {
      if (monthTags[i].style.color === 'gold') {
        monthTags[i].style.color = 'white';
      }
    }
    for (let i = 0; i < LocationTags.length; i++) {
      if (LocationTags[i].style.color === 'gold') {
        LocationTags[i].style.color = 'white';
      }
    }

    const month = e.target.textContent.slice(1, -1);
    if (month.length === 1) {
      onSearch(`20220${month}00`);
    } else {
      onSearch(`2022${month}00`);
    }

    e.target.style.color = 'gold';
  };

  const onClickLocation = (e) => {
    console.log(e.target.textContent.slice(1));
    const searchTag = e.target.textContent.slice(1);

    const LocationTags = e.target.parentNode.children;
    const monthTags = e.target.parentNode.parentNode.children[0].children;

    for (let i = 0; i < LocationTags.length; i++) {
      if (LocationTags[i].style.color === 'gold') {
        LocationTags[i].style.color = 'white';
      }
    }
    for (let i = 0; i < monthTags.length; i++) {
      if (monthTags[i].style.color === 'gold') {
        monthTags[i].style.color = 'white';
      }
    }

    onSearch(searchTag);
    e.target.style.color = 'gold';
  };
  const tagsArr = {
    months: Array(2)
      .fill()
      .map((v, i) => i + 1),
    locations: ['서울', '경기', '강원', '경상', '제주'],
  };

  return (
    <Wrapper>
      {tagsArr.months.map((month) => (
        <button key={month} onClick={onClickMonth}>
          #{month}월
        </button>
      ))}
      {tagsArr.locations.map((location) => (
        <button key={location} onClick={onClickLocation}>
          #{location}
        </button>
      ))}
    </Wrapper>
  );
};

export default Hashtag;
