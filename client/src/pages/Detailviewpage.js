import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import DescTab from '../components/DescTab';
import {
  useLocation,
  Routes,
  Route,
  Link,
  useParams,
  NavLink,
  useNavigate,
} from 'react-router-dom';
import styled from 'styled-components';
import ReviewTab from '../components/ReviewTab';
import HeartButton from '../components/HeartButton';
import onErrorImage from '../assets/noimage.png';
import { ModalContext } from '../contexts/modalContext';
import { Helmet } from 'react-helmet';
import BackImg from '../assets/back-mobile.png';
import ShareImg from '../assets/share-mobile.png';
import HeartImg from '../assets/heart-mobile.png';
import EmptyHeartImg from '../assets/empty-heart.png';
import RatingImg from '../assets/rating-mobile.png';
import axios from 'axios';

const Wrapper = styled.div`
  /* background-color: #8989ed; */
  margin: 0 auto;
  padding: 5rem 248px;
  display: flex;
  flex-direction: column;
  /* width: 81rem; //큰 화면에서 넓어지는 것 때문에 퍼센트말고 rem으로 고정 */
  /* height: 70rem; */
  height: auto;
  overflow: visible;
  justify-content: space-evenly;
  border-radius: 1rem;
  /* margin: 3rem auto; */
  .imgAndSummary {
    /* background-color: green; */
    display: flex;
    justify-content: space-between;

    @media (max-width: 485px) {
      flex-direction: column;
      padding: 0;
    }
  }

  @media (max-width: 485px) {
    padding: 0;
  }
`;

const ImageAndPickbtn = styled.div`
  margin-top: 5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 378px;
  height: 495px;
  /* border: 1px solid black; */
  /* background: red; */
  border-radius: 18px;
  box-shadow: 1px 0px 7px rgb(0 0 0 / 22%);
  & > img {
    width: 100%;
    height: 80%;
    border-radius: 1rem;
    padding: 0.5rem;
    position: relative;
  }

  & > :nth-child(2) {
    width: auto;
    height: 2.8rem;
    border: none;
    position: relative;
    left: 0.5rem;
    /* background: red; */
  }

  button > img {
    width: 36px;
    height: auto;
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

  div {
    width: 459px;
    height: 106px;
    border: 1px solid #d9d9d9;
    border-radius: 7px;
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

const Rating = styled.section`
  margin-top: 11px;
  color: #a0a0a0;
  display: flex;
  /* background-color: red; */
  img {
    height: 18px;
    margin-right: 0.4rem;
  }

  span {
    display: flex;
    margin-left: 1rem;
  }
`;

const Info = styled.section`
  margin: 1rem;
  span:nth-child(1) {
    color: red;
  }

  span:nth-child(2) {
    position: absolute;
    left: 6rem;
  }

  div {
    margin-top: 0.2rem;
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

const Detailviewpage = ({ pickItems, togglePick, authState }) => {
  const { setLoginModal } = useContext(ModalContext);
  const [festival, setFestival] = useState({});
  const [currentTab, setCurrentTab] = useState(0);
  const [like, setLike] = useState(false);
  const activeStyle = {
    color: 'red',
  };
  // const { state } = useLocation();
  // console.log(state);
  const {
    imageUrl,
    title,
    festivalId,
    location,
    startDate,
    endDate,
    overview,
    tel,
    homepageUrl,
  } = festival;
  let navigate = useNavigate();
  let params = useParams();
  console.log('DVP!!', params);

  const onErrorImg = (e) => {
    e.target.src = onErrorImage;
  };
  // let location = useLocation();
  // let regex = /Detailviewpage/;
  // let url = location.pathname;
  // console.log('matches?', url.match(regex));
  // console.log(typeof location.pathname);
  // console.log(!!url.match(regex));

  const tabArr = [
    { name: '상세정보', content: <DescTab festivalInfo={festival} /> },
    {
      name: '리뷰',
      content: <ReviewTab authState={authState} festivalInfo={festival} />,
    },
  ];

  useEffect(() => {
    //해당 상세정보 받아와야됨
    axios
      .get(
        `${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/festivals/${params.festivalId}`
      )
      .then((response) => {
        console.log(response.data);
        setFestival(response.data);
      });
    const isPicked = pickItems.some((ele) => ele.festivalId === festivalId);
    setLike(isPicked);

    window.scrollTo(0, 0);
  }, [festivalId, pickItems]);
  const toggleLike = (event) => {
    setLike(!like);
  };
  const onClickPick = (event, festival) => {
    event.stopPropagation();
    togglePick(festival);
    toggleLike();
  };

  return (
    <>
      <Wrapper>
        {/* <Helmet>
          <title>{title && title} - LOCO</title>
        </Helmet> */}
        <div className="imgAndSummary">
          <ImageAndPickbtn>
            <img
              src={imageUrl || onErrorImage}
              alt={`${title} : 이미지가 존재하지 않습니다.`}
              // onError={onErrorImg}
            ></img>
            <button
              onClick={(e) => {
                if (authState.loginStatus) {
                  onClickPick(e, festival);
                } else {
                  e.stopPropagation();
                  setLoginModal(true);
                }
              }}
            >
              <img alt="heart" src={like ? HeartImg : EmptyHeartImg} />
            </button>
          </ImageAndPickbtn>
          <Summary>
            <h1>{title}</h1>
            <ul>
              <li>{location}</li>
              <li>
                {moment(startDate, 'YYYY.MM.DD').format('YYYY.MM.DD')} ~
                {moment(endDate, 'YYYY.MM.DD').format('YYYY.MM.DD')}
              </li>
            </ul>
            <div>베스트리뷰</div>
            <div>워스트리뷰</div>
          </Summary>
        </div>
        <Tab>
          <Menu>
            <NavLink
              style={({ isActive }) =>
                isActive
                  ? {
                      color: ' #FF9A62',
                      borderBottom: '4px solid #FF9A62',
                    }
                  : {}
              }
              to="./"
            >
              상세 정보
            </NavLink>
            <NavLink
              style={({ isActive }) =>
                isActive
                  ? {
                      color: ' #FF9A62',
                      borderBottom: '4px solid #FF9A62',
                    }
                  : {}
              }
              to="./review"
            >
              후기
            </NavLink>
          </Menu>
          <Routes>
            <Route path="/" element={<DescTab festival={festival} />}></Route>
            <Route
              path="/review"
              element={<ReviewTab festival={festival} authState={authState} />}
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
                    onClickPick(e, festival);
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
          <ReviewTab festival={festival} authState={authState} />
        </MobileWrapper>
      </Wrapper>
    </>
  );
};

export default Detailviewpage;
