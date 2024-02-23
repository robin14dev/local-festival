import React, { useState, useEffect, useContext, useRef } from "react";
import { ModalContext } from "../../contexts/modalContext";
import moment from "moment";
import DescTab from "../../components/DescTab";
import {
  Routes,
  Route,
  useParams,
  NavLink,
  useNavigate,
} from "react-router-dom";
import ReviewTab from "../../components/reviews/ReviewTab";
import onErrorImage from "../../assets/noimage.png";
import { Helmet } from "react-helmet";
import BackImg from "../../assets/back-mobile.png";
import ShareImg from "../../assets/share-mobile.png";
import HeartImg from "../../assets/heart-mobile.png";
import EmptyHeartImg from "../../assets/empty-heart.png";
import RatingImg from "../../assets/rating-mobile.png";
import { ReactComponent as ReviewIcon } from "../../assets/review.svg";
import { ReactComponent as RatingIcon } from "../../assets/rating.svg";
import { ReactComponent as LikeIcon } from "../../assets/heart-fill.svg";

import { ReactComponent as EmojiGood } from "../../assets/emojiGood.svg";
import { ReactComponent as EmojiBad } from "../../assets/emojiBad.svg";
import { ReactComponent as Instagram } from "../../assets/instagram.svg";
import { ReactComponent as Youtube } from "../../assets/youtube.svg";
import { ReactComponent as Homepage } from "../../assets/homepage.svg";

import axios from "axios";
import { showRating } from "../../components/reviews/ReviewItem";
import Loading from "../../components/Loading";
import { UserContext } from "../../contexts/userContext";
import { LoadingWrapper, Wrapper, MobileWrapper, Tab, Menu } from "./styled";

type DetailViewProps = {
  togglePick: togglePick;
};

const DetailView = ({ togglePick }: DetailViewProps) => {
  const modalContext = useContext(ModalContext);
  const { authState } = useContext(UserContext);
  const [like, setLike] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<Summary>({
    average: 0,
    badReview: [
      {
        content: "",
        festivalId: 0,
        id: 0,
        nickname: "",
        rating: 0,
        updatedAt: "",
      },
    ],
    festival: {
      createdAt: "",
      deletedAt: "",
      endDate: 0,
      festivalId: 0,
      homepageUrl: "",
      imageUrl: "",
      location: "",
      overview: "",
      startDate: 0,
      tel: "",
      title: "",
      updatedAt: "",
    },
    goodReview: [
      {
        content: "",
        festivalId: 0,
        id: 0,
        nickname: "",
        rating: 0,
        updatedAt: "",
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
      navigate("reviews?page=1");
      reviewRef.current?.scrollIntoView({ behavior: "smooth" });
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
    { name: "info", text: "상세 정보" },
    { name: "reviews", text: "후기" },
  ];

  const activeStyle = {
    color: `var(--primaryPurple)`,
    borderBottom: "4px solid var(--primaryPurple)",
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
    official: "",
    instagram: "",
    youtube: "",
  };
  if (homepageUrl) {
    const regex = {
      official: /http(s)?:\/\/[a-zA-Z\\d`~!@#$%^&*()-_=+]+/g,
      instagram: /(https?:\/\/www.instagram.com\/[a-zA-Z0-9]+)/g,
      youtube: /(https?:\/\/www.youtube.com\/[a-zA-Z0-9]+)/g,
    };

    if (homepageUrl.match(regex.official)) {
      urlCollection["official"] = homepageUrl.match(regex.official)![0];
    }
    if (homepageUrl.match(regex.instagram)) {
      urlCollection["official"] = homepageUrl.match(regex.instagram)![0];
    }

    if (homepageUrl.match(regex.youtube)) {
      urlCollection["youtube"] = homepageUrl.match(regex.youtube)![0];
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

        <section className="figAndSummary">
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
                      modalContext.setIsLoginModal(true);
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
                  <ReviewIcon width={25} height={25} fill={"#FF9A62"} />
                  {reviewCount}
                </button>
              </div>
            </figcaption>
          </figure>
          <article className="summary">
            <h1>{title}</h1>
            <ul>
              <li>{location}</li>
              <li>
                {moment(startDate, "YYYY.MM.DD").format("YYYY.MM.DD")} ~
                {moment(endDate, "YYYY.MM.DD").format("YYYY.MM.DD")}
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
          </article>
        </section>
        <Tab>
          <Menu ref={reviewRef}>
            {tabMenu.map((menu) => (
              <NavLink
                key={menu.name}
                end={menu.name === "info"}
                to={menu.name === "info" ? "" : `${menu.name}`}
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
              element={<ReviewTab festivalId={summary.festival.festivalId} />}
            ></Route>
          </Routes>
        </Tab>
      </Wrapper>
      {/* 분리를 헤놔서 렌더링이 두번됨 이거 해결해야됨 */}
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
                    modalContext.setIsLoginModal(true);
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
          {moment(startDate, "YYYY.MM.DD").format("YYYY.MM.DD")} ~
          {moment(endDate, "YYYY.MM.DD").format("YYYY.MM.DD")}
        </h3>
        <div className="likeINfo">
          <div>
            <LikeIcon width={23} height={23} fill={"#FF9A62"} />
            {likes}
          </div>
          <div>
            <RatingIcon width={25} height={25} fill={"#FF9A62"} />{" "}
            {average.toFixed(1)}
          </div>
          <div>
            <ReviewIcon width={25} height={25} fill={"#FF9A62"} />
            {reviewCount}
          </div>
        </div>
        <div className="header">
          <h2>상세정보</h2>
        </div>

        <p
          className="description"
          style={{
            wordBreak: "keep-all",
            textIndent: "0.5rem",
            whiteSpace: "pre-line",
          }}
        >
          {overview
            .replace(/<(\/br|br)([^>]*)>/gi, "\n")
            .replace(/&lt;/gi, "<")
            .replace(/&gt;/gi, ">")}
        </p>
        <ul className="infoList">
          <li>
            <div>위치</div> <div>{location}</div>
          </li>
          <li>
            <div>축제 기간</div>
            <div>
              {moment(startDate, "YYYY.MM.DD").format("YYYY.MM.DD")} ~
              {moment(endDate, "YYYY.MM.DD").format("YYYY.MM.DD")}
            </div>
          </li>
          <li>
            <div>문의</div>
            <div>{tel}</div>
          </li>
          <li>
            <div>홈페이지</div>{" "}
            <div>
              {" "}
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
        <ReviewTab festivalId={summary.festival.festivalId} />
      </MobileWrapper>
    </>
  );
};

export default DetailView;
