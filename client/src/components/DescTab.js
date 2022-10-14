import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import phoneImg from '../assets/phone.png';
import linkImg from '../assets/link.png';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: auto;
  /* border: 1px 0 0 0 solid black; */
  /* margin: 1rem; */
  border-radius: 0 0 1rem 1rem;
  padding: 1rem;

  h1 {
    margin-top: 42px;
    margin-bottom: 21px;
  }
  h2 {
    color: #878585;

    font-weight: 600;
    font-size: 22px;
    line-height: 27px;
  }

  h2 + h2 {
    margin-top: 11px;
  }

  p {
    margin-top: 43px;
    margin-bottom: 21px;
  }

  h3 {
    color: #878585;
    img {
      height: 22px;
      margin-right: 22px;
    }
  }

  @media (max-width: 485px) {
    display: none;
  }
`;

const DescTab = ({ festival }) => {
  // 탭메뉴의 상태가 detail(상세정보)이면 특정 행사정보 렌더링
  //             review면 review 컴포넌트 렌더링
  console.log('desktab!!!!');
  let params = useParams();
  console.log('Desktop!!', params);

  console.log(festival);
  const { location, overview, tel, title, homepageUrl, startDate, endDate } =
    festival;

  // let parsedUrl = '';
  // if (homepageUrl !== 'undefined') {
  //   parsedUrl = homepageUrl.split(' ')[1].slice(5).replace(/"/g, '');
  // } else {
  //   parsedUrl = null;
  // }
  return (
    <>
      <Wrapper>
        <h1>{title}</h1>
        <h2> {location}</h2>
        <h2>
          {moment(startDate, 'YYYY.MM.DD').format('YYYY년 MM월 DD일')} ~{' '}
          {moment(endDate, 'YYYY.MM.DD').format('YYYY년 MM월 DD일')}
        </h2>

        <p style={{ wordBreak: 'keep-all', textIndent: '0.5rem' }}>
          {overview}
        </p>

        <h3>
          <img src={phoneImg} alt="phoneImg" /> 문의{' '}
          <a href="tel:{tel}">{tel}</a>
        </h3>

        <h3>
          <img src={linkImg} alt="linkImg" /> 홈페이지{' '}
          <a target="_blank" rel="noreferrer">
            링크
          </a>
        </h3>
      </Wrapper>
    </>
  );
};

export default DescTab;
