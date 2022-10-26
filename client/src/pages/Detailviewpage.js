import React, { useState, useEffect, useContext, useRef } from 'react';
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
import { ModalContext } from '../contexts/modalContext';
import { Helmet } from 'react-helmet';
import BackImg from '../assets/back-mobile.png';
import ShareImg from '../assets/share-mobile.png';
import HeartImg from '../assets/heart-mobile.png';
import EmptyHeartImg from '../assets/empty-heart.png';
import RatingImg from '../assets/rating-mobile.png';
import loadImg from '../assets/loading.gif';
import ReviewImg from '../assets/review.svg';
import { ReactComponent as ReviewIcon } from '../assets/review.svg';
import { ReactComponent as EmojiGood } from '../assets/emojiGood.svg';
import { ReactComponent as EmojiBad } from '../assets/emojiBad.svg';
import axios from 'axios';
import { showRating } from '../components/ReviewItem';

const Wrapper = styled.div`
  margin: 0 auto;
  padding: 5rem 248px;
  display: flex;
  flex-direction: column;
  height: auto;
  overflow: visible;
  justify-content: space-evenly;
  border-radius: 1rem;
  .figAndSummary {
    display: flex;
    justify-content: space-between;

    @media (max-width: 485px) {
      flex-direction: column;
      padding: 0;
    }
  }

  figure {
    margin-top: 5rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 378px;
    height: 495px;
    border-radius: 18px;
    box-shadow: 1px 0px 7px rgb(0 0 0 / 22%);
    & > img {
      width: 100%;
      height: 80%;
      border-radius: 1rem;
      padding: 0.5rem;
      position: relative;
    }

    figcaption {
      width: 100%;
      margin-top: 0.2rem;
      display: flex;
      justify-content: space-between;
      /* align-items: center; */
      padding: 0 1rem;
      /* background-color: yellow; */

      div {
        display: flex;
        align-items: center;
      }
    }
    button {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.1rem;
      margin-right: 0.5rem;
      img,
      svg {
        width: 25px;
        height: auto;
        margin-right: 0.2rem;
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

  @media (max-width: 485px) {
    padding: 0;
  }
`;

const Summary = styled.section`
  /* background-color: yellow; */
  h1 {
    font-weight: 700;
    font-size: 35px;
    line-height: 42px;
    margin-bottom: 21px;
    margin-top: 104px;
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

  .review {
    padding: 0.4rem;
    width: 459px;
    min-height: 106px;
    border: 1px solid #d9d9d9;
    border-radius: 7px;
    .header {
      /* background-color: yellow; */
      color: ${(props) => props.theme.usingColor.mainColor};
      /* font-style: italic; */
      font-weight: 700;
      /* padding: 0 0.5rem; */
      display: flex;
      align-items: center;

      span {
        padding-right: 0.5rem;
        &:nth-child(3) {
          padding-left: 1rem;
        }
      }
    }

    p {
      /* background-color: yellowgreen; */
      /* padding: 0.5rem; */
    }
  }
  div + div {
    margin-top: 14px;
  }

  @media (max-width: 485px) {
    display: none;
    width: 300px;
    & > div {
      display: none;
    }
  }
`;
const Tab = styled.div`
  width: 935px;
  max-height: 1096px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  @media (max-width: 485px) {
    /* width: 100%; */
    display: none;
  }
`;

const Menu = styled.div`
  margin-top: 31px;
  width: 100%;
  /* height: 72px; */
  /* background-color: yellow; */
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

  /* ul {
    display: flex;
    li + li {
      margin-left: 3rem;
      border-bottom: 4px solid #ff9a62;
    }
  } */

  & div.desc {
    text-align: center;
  }

  @media (max-width: 485px) {
    display: none;
  }
`;

const MobileWrapper = styled.section`
  @media (min-width: 485px) {
    display: none;
  }

  .nav {
    display: flex;
    justify-content: space-between;
    height: 80px;
    position: fixed;
    top: 0;
    z-index: 20;
    background-color: white;
    width: 100%;
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

  .header {
    /* background-color: yellow; */
    padding-bottom: 4px;
    border-bottom: 1px solid #d9d9d9;
    width: 95%;
    margin: 0 auto;

    h2 {
      margin-left: 0;
    }
  }
  h1 {
    /* font-style: normal; */
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

      img {
        height: 40%;
        margin-right: 5px;
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
  }

  ul {
    padding: 17px;
    li {
      font-weight: 700;
      font-size: 16px;
      line-height: 26px;
      display: flex;
      div {
        width: 60px;
        & + div {
          width: 260px;
          padding-left: 1rem;
          font-weight: 400;
        }
      }
    }
  }
  padding-bottom: 5rem;
`;

const Detailviewpage = ({ togglePick, authState }) => {
  const { setLoginModal } = useContext(ModalContext);
  const [like, setLike] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState({});
  const reviewRef = useRef(null);
  // const [likes, setLikes] = useState(0)
  /* 
새로고침시, useEffect로 축제에 대한 정보 불러옴 

문제점
현재 코드에선 찜하기 누르면 pickItems가 App에서 변하게 되고 props가 바뀌게 되니깐 DVP가 다시 렌더링됨

원하는 방향
일단 찜하기를 누르면 현재 pickItem에 추가

*/

  let params = useParams();
  let navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        let result = await axios.get(
          `${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/festivals/${params.festivalId}`,
          { params: { userId: authState.userId } }
        );

        setSummary(result.data);
        const isPicked = result.data.isPicked;

        //server에서 할수 있지 않을까?
        /*
        알고싶은것 로그인한 유저가 특정 축제를 찜했는지 아닌지 

        userId, festivalId

        픽 table중에 festivalId가 140000 이면서 userId = 1인게 있는지
        있으면 픽한거고 없으면 픽 안한거고

        그러면 이거로 하면 이전거랑 달라지나?

        현재 DVP에서 pickItems가 쓰이는 용도는 찜 여부를 하트로 표시하는 용도로만 쓰임

        pickItems는 mainpage랑 mypage에서도 쓰임

        여기서는 어차피 쓰여야 하니깐 놔두고 

      하트를 누르면 db에다 저장되는로직을 하나 더만드나?

      DVP에는 pickItems 지우고
      처음에 딱 렌더링될 때 새로운 쿼리로 픽한정보 가져올 수 있음 ㅇㅇ
      하트 눌렀을 때 togglePick작동하면서 pickItems에 찜 추가해주고 db에도 저장
      pickItems가 DVP에 없기 때문에 리렌더링 안되지 않을까?

        
        */

        setLike(isPicked);
        setIsLoading(false);
        window.scrollTo(0, 0);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [params.festivalId, authState.userId]);

  const goToReview = async () => {
    try {
      await navigate('reviews?page=1');
      reviewRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {}

    // console.log(reviewRef.current);
  };
  const toggleLike = (event) => {
    setSummary((prevSummary) => {
      if (like === true) {
        return { ...prevSummary, likes: prevSummary.likes - 1 };
      } else {
        return { ...prevSummary, likes: prevSummary.likes + 1 };
      }
    });
    setLike(!like);
  };
  const onClickPick = (e, festival) => {
    e.stopPropagation();

    togglePick(festival);
    toggleLike();
  };

  const tabMenu = [
    { name: 'info', text: '상세 정보' },
    { name: 'reviews?page=1', text: '후기' },
  ];

  const activeStyle = {
    color: ' #FF9A62',
    borderBottom: '4px solid #FF9A62',
  };

  if (isLoading) {
    return (
      <div>
        <img src={loadImg} alt="loading"></img>로딩중입니다.
      </div>
    );
  }

  if (Object.keys(summary).length === 0) {
    return null;
  }

  const {
    festival: {
      imageUrl,
      title,
      festivalId,
      location,
      startDate,
      endDate,
      overview,
      tel,
    },
    average,
    likes,
    goodReview,
    badReview,
    reviewCount,
  } = summary;

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
                    setLoginModal(true);
                  }
                }}
              >
                <img alt="heart" src={like ? HeartImg : EmptyHeartImg} />
                {likes}
              </button>

              <div>
                <button onClick={goToReview}>
                  <img src={RatingImg} alt="전체평점" /> {average}
                </button>
                <button onClick={goToReview}>
                  <ReviewIcon width={25} height={25} fill={'#FF9A62'} />
                  {reviewCount}
                </button>
              </div>
            </figcaption>
          </figure>
          <Summary>
            <h1>{title}</h1>
            <ul>
              <li>{location}</li>
              <li>
                {moment(startDate, 'YYYY.MM.DD').format('YYYY.MM.DD')} ~
                {moment(endDate, 'YYYY.MM.DD').format('YYYY.MM.DD')}
              </li>
            </ul>
            <div className="review">
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
                '리뷰가 등록되어있지 않습니다'
              )}
            </div>
            <div className="review">
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
                '리뷰가 등록되어있지 않습니다'
              )}
            </div>
          </Summary>
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
                    setLoginModal(true);
                  }
                }}
              >
                <img alt="heart" src={like ? HeartImg : EmptyHeartImg} />
              </button>
            </div>
          </div>
          <h1>{title}</h1>
          <h3>{location}</h3>
          <h3>
            {moment(startDate, 'YYYY.MM.DD').format('YYYY.MM.DD')} ~
            {moment(endDate, 'YYYY.MM.DD').format('YYYY.MM.DD')}
          </h3>
          <div className="likeINfo">
            <div>
              <img src={HeartImg} alt="좋아요 수"></img>
              200
            </div>
            <div>
              <img src={RatingImg} alt="별점"></img>
              4.88
            </div>
            <div>후기 100개</div>
          </div>
          <div className="header">
            <h2>상세정보</h2>
          </div>

          <p>{overview}</p>
          <ul>
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
              <div>홈페이지</div> <div>링크</div>
            </li>
          </ul>
          <div className="header">
            <h2>축제 후기</h2>
          </div>
          <ReviewTab festival={summary.festival} authState={authState} />
        </MobileWrapper>
      </Wrapper>
    </>
  );
};

export default Detailviewpage;
