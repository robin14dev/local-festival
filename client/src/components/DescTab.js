import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { useParams } from 'react-router-dom';

import { ReactComponent as Instagram } from '../assets/instagram.svg';
import { ReactComponent as Youtube } from '../assets/youtube.svg';
import { ReactComponent as Homepage } from '../assets/homepage.svg';
import { ReactComponent as Phone } from '../assets/phone.svg';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: auto;
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

  .contact {
    svg {
      height: 100%;
      width: auto;
      margin-right: 0.5rem;
    }
    button {
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 500;
      font-size: 1rem;

      color: #878585;
    }
    button + button {
      margin-left: 1rem;
    }

    .link {
      display: flex;
      margin-top: 1.5rem;
    }
    div {
      height: 1.8rem;
    }
  }

  @media (max-width: 485px) {
    display: none;
  }
`;

const DescTab = ({ festival }) => {
  // 탭메뉴의 상태가 detail(상세정보)이면 특정 행사정보 렌더링
  //             review면 review 컴포넌트 렌더링
  // console.log('desktab!!!!');
  let params = useParams();
  // console.log('Desktop!!', params);

  // console.log(festival);
  const { location, overview, tel, title, homepageUrl, startDate, endDate } =
    festival;

  console.log(homepageUrl);
  const urlCollection = {
    official: '',
    instagram: '',
    youtube: '',
  };
  if (homepageUrl !== 'undefined') {
    const regex = {
      official: /http(s)?:\/\/[a-zA-Z\\d`~!@#$%^&*()-_=+]+/g,
      instagram: /(https?:\/\/www.instagram.com\/[a-zA-Z0-9]+)/g,
      youtube: /(https?:\/\/www.youtube.com\/[a-zA-Z0-9]+)/g,
    };

    urlCollection['official'] = homepageUrl.match(regex.official)[0];
    if (homepageUrl.match(regex.instagram)) {
      urlCollection['instagram'] = homepageUrl.match(regex.instagram)[0];
    }
    if (homepageUrl.match(regex.youtube)) {
      urlCollection['youtube'] = homepageUrl.match(regex.youtube)[0];
    }
  } else {
  }

  return (
    <>
      <Wrapper>
        <h1>{title}</h1>
        <h2> {location}</h2>
        <h2>
          {moment(startDate, 'YYYY.MM.DD').format('YYYY년 MM월 DD일')} ~{' '}
          {moment(endDate, 'YYYY.MM.DD').format('YYYY년 MM월 DD일')}
        </h2>

        <p
          style={{
            wordBreak: 'keep-all',
            textIndent: '0.5rem',
            whiteSpace: 'pre-line',
          }}
        >
          {overview
            .replace(/<(\/br|br)([^>]*)>/gi, '\n')
            .replace(/&lt;/gi, '<')
            .replace(/&gt;/gi, '>')}
          {/* {overview} */}
        </p>

        <div className="contact">
          <div>
            <button
              onClick={() => {
                document.location.href = `tel:${tel}`;
              }}
            >
              <Phone />
              {tel}
            </button>
          </div>

          <div className="link">
            {!!urlCollection.official && (
              <button
                onClick={() => {
                  window.open(urlCollection.official);
                }}
              >
                <Homepage /> 공식 홈페이지
              </button>
            )}
            {!!urlCollection.instagram && (
              <button
                onClick={() => {
                  window.open(urlCollection.instagram);
                }}
              >
                <Instagram /> 인스타그램 계정
              </button>
            )}
            {!!urlCollection.youtube && (
              <button
                onClick={() => {
                  window.open(urlCollection.youtube);
                }}
              >
                <Youtube /> 유튜브 채널
              </button>
            )}
          </div>
        </div>
      </Wrapper>
    </>
  );
};

export default DescTab;
