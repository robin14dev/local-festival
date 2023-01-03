import React, { useState, useEffect, useContext, useRef } from 'react';
import { ModalContext } from '../contexts/modalContext';
import moment from 'moment';
import DescTab from '../components/DescTab';
import {
  Routes,
  Route,
  useParams,
  NavLink,
  useNavigate,
} from 'react-router-dom';
import styled from 'styled-components';
import ReviewTab from '../components/ReviewTab';
import onErrorImage from '../assets/noimage.png';
import { Helmet } from 'react-helmet';
import BackImg from '../assets/back-mobile.png';
import ShareImg from '../assets/share-mobile.png';
import HeartImg from '../assets/heart-mobile.png';
import EmptyHeartImg from '../assets/empty-heart.png';
import RatingImg from '../assets/rating-mobile.png';
import { ReactComponent as ReviewIcon } from '../assets/review.svg';
import { ReactComponent as RatingIcon } from '../assets/rating.svg';
import { ReactComponent as LikeIcon } from '../assets/heart-fill.svg';

import { ReactComponent as EmojiGood } from '../assets/emojiGood.svg';
import { ReactComponent as EmojiBad } from '../assets/emojiBad.svg';
import { ReactComponent as Instagram } from '../assets/instagram.svg';
import { ReactComponent as Youtube } from '../assets/youtube.svg';
import { ReactComponent as Homepage } from '../assets/homepage.svg';

import axios from 'axios';
import { showRating } from '../components/ReviewItem';
import Loading, { Wrapper as W } from '../components/Loading';

const LoadingWrapper = styled(W)`
  margin-top: 50vh;
`;

const Wrapper = styled.section`
  flex: 1 1 auto;
  width: 81rem;
  max-width: 1296px;
  margin: 5rem auto 0 auto;
  padding: 0 8rem;
  display: flex;
  flex-direction: column;
  overflow: visible;
  justify-content: space-evenly;
  align-items: center;

  .figAndSummary {
    width: 100%;
    display: flex;
    flex: 1 1 auto;
    justify-content: space-between;
    background-color: white;
    padding: 0 1rem;

    @media (max-width: 485px) {
      flex-direction: column;
    }
  }

  figure {
    background-color: white;
    flex: 1 1 0;
    width: 378px;
    max-width: 383px;
    margin-top: 5rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    aspect-ratio: 383/502;
    border-radius: 18px;
    box-shadow: 1px 0px 7px rgb(0 0 0 / 22%);
    & > img {
      width: 100%;
      max-width: 100%;
      height: 80%;
      border-radius: 1rem;
      padding: 0.5rem;
    }

    figcaption {
      width: 100%;
      margin-top: 0.2rem;
      display: flex;
      justify-content: space-between;
      padding: 0 1rem;

      div {
        display: flex;
        align-items: center;
      }
      button {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.1rem;
        margin-right: 0.5rem;
        color: gray;
        img,
        svg {
          width: 25px;
          height: auto;
          margin-right: 0.2rem;
        }
      }
    }

    @media (max-width: 485px) {
      padding: 0;
      width: auto;
      height: 260px;
      border-radius: 0;
      box-shadow: none;

      & > img {
        padding: 0;
        border-radius: 0;
        object-fit: contain;
        height: 100%;
      }

      button {
        display: none;
      }
    }
  }

  .summary {
    flex: 1 1 0;
    max-width: 526px;
    margin-top: 5rem;
    background-color: transparent;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    h1 {
      font-weight: 700;
      font-size: 2rem;
      line-height: 42px;
    }

    ul {
      margin-bottom: 52px;
    }

    li {
      font-weight: 500;
      font-size: 22px;
      line-height: 27px;
      max-width: 400px;
      color: #a0a0a0;
    }

    .reviews {
      background-color: white;
      flex: 0 1 auto;
      padding: 0.4rem;

      width: 100%;
      height: 116px;
      max-height: 116px;
      border: 1px solid #d9d9d9;
      border-radius: 7px;
      .header {
        color: var(--mainColor);
        font-weight: 700;
        display: flex;
        align-items: center;

        span {
          padding-right: 0.5rem;
          &:nth-child(3) {
            padding-left: 1rem;
          }
        }
      }
      .noReview {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #a0a0a0;
      }
    }
    div + div {
      margin-top: 14px;
    }
    @media screen and (max-width: 845px) {
      h1 {
        font-size: 1.5rem;
      }
    }

    @media (max-width: 485px) {
      display: none;
      width: 300px;
      & > div {
        display: none;
      }
    }
  }

  @media (max-width: 1296px) {
    width: 100vw;
    .figAndSummary {
      width: 1040px;
    }
  }
  @media (max-width: 1076px) {
    .figAndSummary {
      width: 100vw;
    }
    .summary {
      padding-left: 1rem;
    }
  }

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const Tab = styled.div`
  width: 65rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  @media (max-width: 1076px) {
    width: 100vw;
  }

  @media (max-width: 485px) {
    display: none;
  }
`;

const Menu = styled.nav`
  margin-top: 31px;
  color: rgba(73, 73, 73, 0.5);
  font-weight: bold;
  font-size: 1.5rem;
  display: flex;
  justify-items: center;
  align-items: center;
  list-style: none;
  border-bottom: 1px solid #d9d9d9;
  & > div {
    width: 100%;
  }

  a {
    text-decoration: none;
    width: 115px;
    text-align: center;
    color: #acacac;
    font-size: 22px;
    line-height: 49px;
    font-weight: 600;
  }

  & div.desc {
    text-align: center;
  }

  @media (max-width: 485px) {
    display: none;
  }
`;

const MobileWrapper = styled.section`
  padding-top: 5rem;
  display: none;
  @media (max-width: 768px) {
    display: block;
  }

  .nav {
    display: flex;
    justify-content: space-between;
    height: 80px;
    position: fixed;
    top: 0;
    z-index: 20;
    background-color: white;
    width: 100vw;
    padding: 1rem;
    box-shadow: 0px 1px 4px lightgrey;
    img {
      height: 34px;
    }

    div {
      display: flex;
      align-items: center;
      img {
        height: 24px;
        margin-left: 1.1rem;
      }
    }
  }

  & > img {
    width: 100%;
    height: 40vh;
    object-fit: contain;
  }

  .header {
    padding-bottom: 4px;
    border-bottom: 1px solid #d9d9d9;
    width: 95%;
    margin: 0 auto;

    h2 {
      margin-left: 0;
    }
  }
  h1 {
    font-weight: 700;
    font-size: 22px;
    margin-top: 17px;
    margin-bottom: 21px;
    margin-left: 9px;
  }

  h3 {
    font-weight: 400;
    font-size: 16px;

    color: #a0a0a0;
    margin-left: 18px;
  }

  .likeINfo {
    margin-top: 1rem;
    height: 37px;
    color: #a0a0a0;

    display: flex;
    div {
      padding-left: 11px;
      display: flex;
      align-items: center;

      svg {
        margin-right: 0.5rem;
      }
    }
  }

  h2 {
    font-weight: 600;
    font-size: 20px;
    margin-left: 14px;
    margin-top: 40px;
  }

  p {
    padding: 18px;
    line-height: 1.5;
  }

  .infoList {
    padding: 17px;
    li {
      font-weight: 700;
      font-size: 16px;
      line-height: 26px;
      display: flex;
      & > div {
        width: 60px;
        @media screen and (max-width: 375px) {
          font-size: 0.8rem;
        }
        & + div {
          width: 260px;
          padding-left: 1rem;
          font-weight: 400;
        }
      }

      button {
        display: flex;
        align-items: center;
        line-height: 1;

        svg {
          height: 100%;
          margin-right: 0.3rem;
        }
      }
    }
  }
  padding-bottom: 5rem;
`;

type DetailViewProps = {
  togglePick: togglePick;
  authState: AuthState;
};

const DetailView = ({ togglePick, authState }: DetailViewProps) => {
  const modalContext = useContext(ModalContext);
  const [like, setLike] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<Summary>({
    average: 0,
    badReview: [
      {
        content: '',
        festivalId: 0,
        id: 0,
        nickname: '',
        rating: 0,
        updatedAt: '',
      },
    ],
    festival: {
      createdAt: '',
      deletedAt: '',
      endDate: 0,
      festivalId: 0,
      homepageUrl: '',
      imageUrl: '',
      location: '',
      overview: '',
      startDate: 0,
      tel: '',
      title: '',
      updatedAt: '',
    },
    goodReview: [
      {
        content: '',
        festivalId: 0,
        id: 0,
        nickname: '',
        rating: 0,
        updatedAt: '',
      },
    ],
    isPicked: false,
    likes: 0,
    reviewCount: 0,
  });
  const reviewRef = useRef<HTMLElement | null>(null);

  let params = useParams();
  let navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        let result = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/festivals/${params.festivalId}`,
          { params: { userId: authState.userId } }
        );
        console.log(result.data);
        setSummary(result.data);
        const isPicked = result.data.isPicked;

        setLike(isPicked);
        setIsLoading(false);
        window.scrollTo(0, 0);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [params.festivalId, authState.userId]);

  const goToReview = () => {
    try {
      navigate('reviews?page=1');
      reviewRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {}
  };
  const toggleLike = () => {
    setSummary((prevSummary) => {
      if (like === true) {
        return { ...prevSummary, likes: prevSummary.likes - 1 };
      } else {
        return { ...prevSummary, likes: prevSummary.likes + 1 };
      }
    });
    setLike(!like);
  };
  const onClickPick = (
    e: React.MouseEvent<HTMLButtonElement>,
    festival: FestivalItem
  ) => {
    e.stopPropagation();

    togglePick(festival);
    toggleLike();
  };

  const tabMenu = [
    { name: 'info', text: '상세 정보' },
    { name: 'reviews?page=1', text: '후기' },
  ];

  const activeStyle = {
    color: `var(--primaryPurple)`,
    borderBottom: '4px solid var(--primaryPurple)',
  };

  if (Object.keys(summary).length === 0) {
    return null;
  }

  const {
    festival: {
      imageUrl,
      title,
      location,
      startDate,
      endDate,
      overview,
      tel,
      homepageUrl,
    },
    average,
    likes,
    goodReview,
    badReview,
    reviewCount,
  } = summary;

  const urlCollection = {
    official: '',
    instagram: '',
    youtube: '',
  };
  if (homepageUrl) {
    const regex = {
      official: /http(s)?:\/\/[a-zA-Z\\d`~!@#$%^&*()-_=+]+/g,
      instagram: /(https?:\/\/www.instagram.com\/[a-zA-Z0-9]+)/g,
      youtube: /(https?:\/\/www.youtube.com\/[a-zA-Z0-9]+)/g,
    };

    if (homepageUrl.match(regex.official)) {
      urlCollection['official'] = homepageUrl.match(regex.official)![0];
    }
    if (homepageUrl.match(regex.instagram)) {
      urlCollection['official'] = homepageUrl.match(regex.instagram)![0];
    }

    if (homepageUrl.match(regex.youtube)) {
      urlCollection['youtube'] = homepageUrl.match(regex.youtube)![0];
    }
  }
  if (isLoading) {
    return (
      <LoadingWrapper>
        <Loading text="상세페이지를 불러오고 있습니다" />
      </LoadingWrapper>
    );
  }

  return (
    <>
      <Wrapper>
        <Helmet>
          <title>{`${summary.festival.title} - LOCO `}</title>
        </Helmet>

        <div className="figAndSummary">
          <figure>
            <img
              src={imageUrl || onErrorImage}
              alt={`${title} : 이미지가 존재하지 않습니다.`}
            ></img>
            <figcaption>
              <button
                onClick={(e) => {
                  if (authState.loginStatus) {
                    onClickPick(e, summary.festival);
                  } else {
                    e.stopPropagation();
                    if (modalContext) {
                      modalContext.setLoginModal(true);
                    }
                  }
                }}
              >
                <img alt="heart" src={like ? HeartImg : EmptyHeartImg} />
                {likes}
              </button>

              <div>
                <button onClick={goToReview}>
                  <img src={RatingImg} alt="전체평점" /> {average.toFixed(1)}
                </button>
                <button onClick={goToReview}>
                  <ReviewIcon width={25} height={25} fill={'#FF9A62'} />
                  {reviewCount}
                </button>
              </div>
            </figcaption>
          </figure>
          <section className="summary">
            <h1>{title}</h1>
            <ul>
              <li>{location}</li>
              <li>
                {moment(startDate, 'YYYY.MM.DD').format('YYYY.MM.DD')} ~
                {moment(endDate, 'YYYY.MM.DD').format('YYYY.MM.DD')}
              </li>
            </ul>
            <div className="reviews">
              {goodReview[0] ? (
                <>
                  <div className="header">
                    <span>최고에요</span>
                    <span>
                      <EmojiGood width={25} height={25} />
                    </span>
                    <span>{showRating(goodReview[0].rating)}</span>
                  </div>
                  <p>{goodReview[0].content}</p>
                </>
              ) : (
                <div className="noReview">4점 이상의 리뷰가 없습니다</div>
              )}
            </div>
            <div className="reviews">
              {badReview[0] ? (
                <>
                  <div className="header">
                    <span>별로에요</span>
                    <span>
                      <EmojiBad width={25} height={25} />
                    </span>
                    <span>{showRating(badReview[0].rating)}</span>
                  </div>
                  <p>{badReview[0].content}</p>
                </>
              ) : (
                <div className="noReview">2점 이하의 리뷰가 없습니다</div>
              )}
            </div>
          </section>
        </div>
        <Tab>
          <Menu ref={reviewRef}>
            {tabMenu.map((menu) => (
              <NavLink
                key={menu.name}
                end={menu.name === 'info'}
                to={menu.name === 'info' ? '' : `${menu.name}`}
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
              >
                {menu.text}
              </NavLink>
            ))}
          </Menu>
          <Routes>
            <Route
              index
              element={<DescTab festival={summary.festival} />}
            ></Route>
            <Route
              path="reviews/*"
              element={
                <ReviewTab festival={summary.festival} authState={authState} />
              }
            ></Route>
          </Routes>
        </Tab>
      </Wrapper>
      <MobileWrapper>
        <div className="nav">
          <button onClick={() => navigate(-1)}>
            <img src={BackImg} alt="뒤로가기"></img>
          </button>
          <div>
            <button>
              <img src={ShareImg} alt="공유하기"></img>
            </button>
            <button
              onClick={(e) => {
                if (authState.loginStatus) {
                  onClickPick(e, summary.festival);
                } else {
                  e.stopPropagation();
                  if (modalContext) {
                    modalContext.setLoginModal(true);
                  }
                }
              }}
            >
              <img alt="heart" src={like ? HeartImg : EmptyHeartImg} />
            </button>
          </div>
        </div>
        <img
          src={imageUrl || onErrorImage}
          alt={`${title} : 이미지가 존재하지 않습니다.`}
        ></img>
        <h1>{title}</h1>
        <h3>{location}</h3>
        <h3>
          {moment(startDate, 'YYYY.MM.DD').format('YYYY.MM.DD')} ~
          {moment(endDate, 'YYYY.MM.DD').format('YYYY.MM.DD')}
        </h3>
        <div className="likeINfo">
          <div>
            <LikeIcon width={23} height={23} fill={'#FF9A62'} />
            {likes}
          </div>
          <div>
            <RatingIcon width={25} height={25} fill={'#FF9A62'} /> {average}
          </div>
          <div>
            <ReviewIcon width={25} height={25} fill={'#FF9A62'} />
            {reviewCount}
          </div>
        </div>
        <div className="header">
          <h2>상세정보</h2>
        </div>

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
        </p>
        <ul className="infoList">
          <li>
            <div>위치</div> <div>{location}</div>
          </li>
          <li>
            <div>축제 기간</div>
            <div>
              {moment(startDate, 'YYYY.MM.DD').format('YYYY.MM.DD')} ~
              {moment(endDate, 'YYYY.MM.DD').format('YYYY.MM.DD')}
            </div>
          </li>
          <li>
            <div>문의</div>
            <div>{tel}</div>
          </li>
          <li>
            <div>홈페이지</div>{' '}
            <div>
              {' '}
              {!!urlCollection.official && (
                <button
                  onClick={() => {
                    window.open(urlCollection.official);
                  }}
                >
                  <Homepage width={24} height={24} /> 공식 홈페이지
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
          </li>
        </ul>
        <div className="header">
          <h2>축제 후기</h2>
        </div>
        <ReviewTab festival={summary.festival} authState={authState} />
      </MobileWrapper>
    </>
  );
};

export default DetailView;
